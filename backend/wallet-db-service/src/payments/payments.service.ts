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
  async initiatePayment(dto: InitiatePaymentDto) {
    // Destructure input
    const { fromDocument, fromPhone, toDocument, toPhone, amount } = dto;

    // Find both customers and their wallets
    const fromCustomer = await this.customerRepo.findOne({
      where: { document: fromDocument, phone: fromPhone },
      relations: ['wallet'],
    });
    if (!fromCustomer || !fromCustomer.wallet) {
      throw new NotFoundException(
        'Payer not found with given document and phone',
      );
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
}
