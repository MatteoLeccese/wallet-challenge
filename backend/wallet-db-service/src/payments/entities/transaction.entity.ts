import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  type TransactionStatus,
  type TransactionType,
} from 'src/payments/types/transaction.interfaces';
import { DecimalTransformer } from 'src/common/decimal.transformer';
import { PaymentSession } from './payment-session.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @Column() type: TransactionType;

  @Column('decimal', {
    precision: 14,
    scale: 2,
    transformer: DecimalTransformer,
  })
  amount: number;

  @Column() status: TransactionStatus;

  @ManyToOne(() => PaymentSession, { nullable: true })
  paymentSession?: PaymentSession;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}
