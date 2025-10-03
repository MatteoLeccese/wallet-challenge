// src/wallets/wallets.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Customer } from 'src/clients/entities/customer.entity';
import { Transaction } from 'src/payments/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction, Customer])],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
