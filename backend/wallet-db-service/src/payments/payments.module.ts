import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentSession } from './entities/payment-session.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { Customer } from 'src/clients/entities/customer.entity';
import { Transaction } from './entities/transaction.entity';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentSession, Wallet, Customer, Transaction]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, MailerService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
