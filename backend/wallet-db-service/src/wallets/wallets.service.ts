import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { Customer } from 'src/clients/entities/customer.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async createForCustomer(customer: Customer): Promise<Wallet> {
    const wallet = this.walletRepository.create({
      customer,
      balance: '0.00',
    });
    return this.walletRepository.save(wallet);
  }
}
