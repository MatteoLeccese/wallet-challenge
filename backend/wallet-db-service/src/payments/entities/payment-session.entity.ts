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

@Entity('payment_sessions')
export class PaymentSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'char', length: 6 })
  token: string;

  @Column({ type: 'boolean', default: false })
  confirmed: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.paymentSessions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  wallet: Wallet | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
