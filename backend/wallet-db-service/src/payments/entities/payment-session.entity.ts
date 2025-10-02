import { DecimalTransformer } from 'src/common/decimal.transformer';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { type SessionStatus } from '../types/session.interfaces';

@Entity('payment_sessions')
export class PaymentSession {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Wallet, { nullable: false })
  sourceWallet: Wallet;

  @ManyToOne(() => Wallet, { nullable: true })
  targetWallet?: Wallet;

  @Column('decimal', {
    precision: 14,
    scale: 2,
    transformer: DecimalTransformer,
  })
  amount: number;

  @Column({ length: 6 }) token: string;

  @Column() tokenExpiresAt: Date;

  @Column() status: SessionStatus;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}
