import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentSession } from './entities/payment-session.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { Customer } from 'src/clients/entities/customer.entity';
import { Transaction } from './entities/transaction.entity';
import { InitiatePaymentDto } from './types/initiate-payment.dto';
import { ConfirmPaymentDto } from './types/confirm-payment.dto';
import { PaymentSessionStatus } from './types/session.interfaces';
import { TransactionType } from './types/transaction.interfaces';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfirmPurchaseDto } from './types/confirm-purchase.dto';
import { InitiatePurchaseDto } from './types/initiate-purchase.dto';
import { OtherBalanceQueryDto } from './types/other-balance-query.dto';

const TOKEN_EXP_MINUTES = 5;

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentSession)
    private readonly paymentSessionRepo: Repository<PaymentSession>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly mailerService: MailerService,
  ) {}

  // Generate a 6-digit numeric token as string
  private generateToken(): string {
    const num = Math.floor(100000 + Math.random() * 900000);
    return String(num);
  }

  // Compute expiration date by adding minutes to current time
  private computeExpiration(minutes: number): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  // Initiate a payment session
  async initiatePayment(userId: number, dto: InitiatePaymentDto) {
    // Destructure input
    const { toDocument, toPhone, amount } = dto;

    // Find the paying customer (the current user)
    const fromCustomer = await this.customerRepo.findOne({
      where: { id: userId },
      relations: ['wallet'],
    });

    // VAlidate the payer and wallet
    if (!fromCustomer || !fromCustomer.wallet) {
      throw new NotFoundException('Payer wallet not found');
    }

    // Find the receiver
    const toCustomer = await this.customerRepo.findOne({
      where: { document: toDocument, phone: toPhone },
      relations: ['wallet'],
    });
    if (!toCustomer || !toCustomer.wallet) {
      throw new NotFoundException(
        'Receiver not found with given document and phone',
      );
    }

    // Validate amount and balance
    const fromBalance = parseFloat(fromCustomer.wallet.balance.toString());

    // Amount must be positive and non-zero
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    // Payer must have sufficient balance
    if (fromBalance < amount) {
      throw new ForbiddenException('Insufficient balance');
    }

    // Create the payment session token
    const token = this.generateToken();

    // Create the payment session
    const session = this.paymentSessionRepo.create({
      fromWallet: fromCustomer.wallet,
      toWallet: toCustomer.wallet,
      amount: amount.toFixed(2),
      status: PaymentSessionStatus.PENDING,
      token,
      expiresAt: this.computeExpiration(TOKEN_EXP_MINUTES),
    });

    // Save the payment session
    const savedSession = await this.paymentSessionRepo.save(session);

    // Send the email with the token
    await this.mailerService.sendPaymentToken(
      fromCustomer.email,
      token,
      savedSession.id,
    );

    return {
      message: 'Payment session created and token sent to the registered email',
      data: {
        sessionId: savedSession.id,
        expiresAt: savedSession.expiresAt,
      },
    };
  }

  // Confirm a payment session
  async confirmPayment(dto: ConfirmPaymentDto) {
    // Destructure input
    const { sessionId, token } = dto;

    // Find the payment session
    const session = await this.paymentSessionRepo.findOne({
      where: { id: sessionId },
      relations: ['fromWallet', 'toWallet'],
    });

    // If the session is not found or not pending, throw error
    if (!session) {
      throw new NotFoundException('Payment session not found');
    }
    if (session.status !== PaymentSessionStatus.PENDING) {
      throw new BadRequestException('Payment session is not pending');
    }

    // Handle nullable expiresAt
    if (!session.expiresAt) {
      session.status = PaymentSessionStatus.EXPIRED;
      await this.paymentSessionRepo.save(session);
      throw new BadRequestException('Payment session has expired');
    }

    // Declare current time and expiry time
    const now = new Date();
    const expiry = new Date(session.expiresAt);

    // Check if the session has expired
    if (now > expiry) {
      session.status = PaymentSessionStatus.EXPIRED;
      await this.paymentSessionRepo.save(session);
      throw new BadRequestException('Payment session has expired');
    }

    // Compare tokens (plain, per your entity)
    if (token !== session.token) {
      throw new ForbiddenException('Invalid token');
    }

    // Validate wallets are present
    if (!session.fromWallet || !session.toWallet) {
      throw new NotFoundException('Wallets involved in payment not found');
    }

    // Fetch latest balances
    const fromWallet = await this.walletRepo.findOne({
      where: { id: session.fromWallet.id },
    });
    const toWallet = await this.walletRepo.findOne({
      where: { id: session.toWallet.id },
    });

    // Validate wallets again
    if (!fromWallet || !toWallet) {
      throw new NotFoundException('Wallets involved in payment not found');
    }

    // Check again for sufficient balance
    const amount = parseFloat(session.amount.toString());
    const fromBalance = parseFloat(fromWallet.balance.toString());
    if (fromBalance < amount) {
      session.status = PaymentSessionStatus.FAILED;
      await this.paymentSessionRepo.save(session);
      throw new ForbiddenException('Insufficient balance at confirmation');
    }

    // Update balances
    fromWallet.balance = (fromBalance - amount).toFixed(2);
    toWallet.balance = (
      parseFloat(toWallet.balance.toString()) + amount
    ).toFixed(2);
    await this.walletRepo.save([fromWallet, toWallet]);

    // Register transactions
    const paymentTx = this.transactionRepo.create({
      type: TransactionType.PAYMENT,
      amount: amount.toFixed(2),
      wallet: fromWallet,
      referenceId: session.id,
    });
    const debitTx = this.transactionRepo.create({
      type: TransactionType.DEBIT,
      amount: amount.toFixed(2),
      wallet: fromWallet,
      referenceId: session.id,
    });
    const creditTx = this.transactionRepo.create({
      type: TransactionType.CREDIT,
      amount: amount.toFixed(2),
      wallet: toWallet,
      referenceId: session.id,
    });

    // Save all transactions
    await this.transactionRepo.save([paymentTx, debitTx, creditTx]);

    // Update session status to CONFIRMED
    session.status = PaymentSessionStatus.CONFIRMED;
    await this.paymentSessionRepo.save(session);

    return {
      message: 'Payment confirmed successfully',
      data: {
        sessionId: session.id,
        amount: amount.toFixed(2),
        fromWalletId: fromWallet.id,
        toWalletId: toWallet.id,
      },
    };
  }

  // Initiate a purchase session
  async initiatePurchase(userId: number, dto: InitiatePurchaseDto) {
    // Extracting the amount from the DTO
    const { amount } = dto;

    // Find the customer and their wallet
    const customer = await this.customerRepo.findOne({
      where: { id: userId },
      relations: ['wallet'],
    });

    // Validate customer and wallet
    if (!customer || !customer.wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Validate amount and balance
    const balance = parseFloat(customer.wallet.balance.toString());
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }
    if (balance < amount) {
      throw new ForbiddenException('Insufficient balance');
    }

    // Generate the payment session token
    const token = this.generateToken();

    // Create the payment session
    const session = this.paymentSessionRepo.create({
      fromWallet: customer.wallet,
      toWallet: null,
      amount: amount.toFixed(2),
      status: PaymentSessionStatus.PENDING,
      token,
      expiresAt: this.computeExpiration(TOKEN_EXP_MINUTES),
    });

    // Save the payment session
    const saved = await this.paymentSessionRepo.save(session);

    // Sends the email with the token
    await this.mailerService.sendPaymentToken(customer.email, token, saved.id);

    return {
      message: 'Purchase session created and token sent to your email',
      data: {
        sessionId: saved.id,
        expiresAt: saved.expiresAt,
      },
    };
  }

  // Confirm a purchase session
  async confirmPurchase(userId: number, dto: ConfirmPurchaseDto) {
    // Destructure input
    const { sessionId, token } = dto;

    // Find the purchase session
    const session = await this.paymentSessionRepo.findOne({
      where: { id: sessionId },
      relations: ['fromWallet', 'fromWallet.customer'],
    });

    // Validate session existence
    if (!session) {
      throw new NotFoundException('Purchase session not found');
    }

    // Validate session status
    if (session.status !== PaymentSessionStatus.PENDING) {
      throw new BadRequestException('Session not pending');
    }

    // Check for expiration
    if (!session.expiresAt || new Date() > new Date(session.expiresAt)) {
      session.status = PaymentSessionStatus.EXPIRED;
      await this.paymentSessionRepo.save(session);
      throw new BadRequestException('Purchase session expired');
    }

    // Validate token
    if (token !== session.token) {
      throw new ForbiddenException('Invalid token');
    }

    // Validate the session belongs to the user
    if (!session.fromWallet || session.fromWallet.customer?.id !== userId) {
      throw new ForbiddenException(
        'This purchase does not belong to the current user',
      );
    }

    // Fetch the latest wallet data
    const wallet = await this.walletRepo.findOne({
      where: { id: session.fromWallet.id },
    });

    // Validate wallet existence
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check for sufficient balance
    const balance = parseFloat(wallet.balance.toString());
    const amount = parseFloat(session.amount.toString());
    if (balance < amount) {
      session.status = PaymentSessionStatus.FAILED;
      await this.paymentSessionRepo.save(session);
      throw new ForbiddenException('Insufficient balance');
    }

    // Deduct balance and save
    wallet.balance = (balance - amount).toFixed(2);
    await this.walletRepo.save(wallet);

    // Register the transaction
    const transaction = this.transactionRepo.create({
      type: TransactionType.PURCHASE,
      amount: amount.toFixed(2),
      wallet,
      referenceId: session.id,
    });

    // Save the transaction
    await this.transactionRepo.save(transaction);

    // Update session status to CONFIRMED
    session.status = PaymentSessionStatus.CONFIRMED;
    await this.paymentSessionRepo.save(session);

    return {
      message: 'Purchase confirmed successfully',
      data: {
        sessionId: session.id,
        amount: amount.toFixed(2),
        walletId: wallet.id,
        newBalance: wallet.balance,
      },
    };
  }

  // Get client balance
  async getBalance(userId: number) {
    // Find the current user's customer and wallet
    const customer = await this.customerRepo.findOne({
      where: { id: userId },
      relations: ['wallet'],
    });

    // If the customer or wallet is not found we throw an error
    if (!customer || !customer.wallet) {
      throw new NotFoundException(
        'Customer not found with given document and phone',
      );
    }

    // Fetch the wallet with relations
    const wallet = await this.walletRepo.findOne({
      where: { id: customer.wallet.id },
      relations: ['transactions', 'outgoingPayments', 'incomingPayments'],
    });

    // If the wallet is not found we throw an error
    if (!wallet) {
      throw new NotFoundException('Wallet not found for this customer');
    }

    // Return the balance
    return {
      message: 'Balance retrieved successfully',
      data: {
        customerId: customer.id,
        walletId: wallet.id,
        balance: wallet.balance,
        transactions: wallet.transactions.map((transaction) => ({
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount,
          referenceId: transaction.referenceId,
          createdAt: transaction.createdAt,
        })),
        outgoingPayments: wallet.outgoingPayments.map((outgoingPayment) => ({
          id: outgoingPayment.id,
          amount: outgoingPayment.amount,
          status: outgoingPayment.status,
          createdAt: outgoingPayment.createdAt,
        })),
        incomingPayments: wallet.incomingPayments.map((incomingPayment) => ({
          id: incomingPayment.id,
          amount: incomingPayment.amount,
          status: incomingPayment.status,
          createdAt: incomingPayment.createdAt,
        })),
      },
    };
  }

  // Get specific user's balance by document and phone
  async getSpecificUserBalance(dto: OtherBalanceQueryDto) {
    // Destructure input
    const { document, phone } = dto;

    // Find the specific customer's wallet
    const customer = await this.customerRepo.findOne({
      where: { document, phone },
      relations: ['wallet'],
    });

    // If the customer or wallet is not found we throw an error
    if (!customer || !customer.wallet) {
      throw new NotFoundException(
        'Customer not found with given document and phone',
      );
    }

    // Fetch the wallet with relations
    const wallet = await this.walletRepo.findOne({
      where: { id: customer.wallet.id },
      relations: ['transactions'],
    });

    // If the wallet is not found we throw an error
    if (!wallet) {
      throw new NotFoundException('Wallet not found for this customer');
    }

    return {
      message: 'Specific user balance retrieved successfully',
      data: {
        customerId: customer.id,
        walletId: wallet.id,
        balance: wallet.balance,
        transactions: wallet.transactions.map((transaction) => ({
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount,
          referenceId: transaction.referenceId,
          createdAt: transaction.createdAt,
        })),
      },
    };
  }
}
