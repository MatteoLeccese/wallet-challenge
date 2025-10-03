import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { PaymentSessionStatus } from '../types/session.interfaces';

@Entity('payment_sessions')
export class PaymentSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'char', length: 6 })
  token: string;

  @Column({
    type: 'enum',
    enum: PaymentSessionStatus,
    default: PaymentSessionStatus.PENDING,
  })
  status: PaymentSessionStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.outgoingPayments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  fromWallet: Wallet | null;

  @ManyToOne(() => Wallet, (wallet) => wallet.incomingPayments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  toWallet: Wallet | null;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
