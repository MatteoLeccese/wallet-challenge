import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { Customer } from 'src/clients/entities/customer.entity';
import { TopUpWalletDto } from './entities/topup-wallet.dto';
import { TransactionType } from 'src/payments/types/transaction.interfaces';
import { Transaction } from 'src/payments/entities/transaction.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  // Create a wallet for a customer
  async createForCustomer(customer: Customer): Promise<Wallet> {
    const wallet = this.walletRepository.create({
      customer,
      balance: '0.00',
    });
    return this.walletRepository.save(wallet);
  }

  // Top-up wallet
  async topUp(dto: TopUpWalletDto) {
    // Destructure input
    const { document, phone, amount } = dto;

    // Find customer by document and phone
    const customer = await this.customerRepository.findOne({
      where: { document, phone },
      relations: ['wallet'],
    });

    // If the customer is not found we throw an error
    if (!customer) {
      throw new NotFoundException(
        'Customer not found with given document and phone',
      );
    }

    // Update the wallet balance
    customer.wallet.balance = (
      parseFloat(customer.wallet.balance.toString()) + amount
    ).toFixed(2);

    await this.walletRepository.save(customer.wallet);

    // Register the transaction
    const transaction = this.transactionRepository.create({
      type: TransactionType.TOP_UP,
      amount: String(amount.toFixed(2)),
      wallet: customer.wallet,
    });

    // Save the transaction
    await this.transactionRepository.save(transaction);

    // return the result of the operation
    return {
      message: 'Wallet recharged successfully',
      data: {
        customerId: customer.id,
        walletId: customer.wallet.id,
        newBalance: customer.wallet.balance,
        transactionId: transaction.id,
      },
    };
  }
}
