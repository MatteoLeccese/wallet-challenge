import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  Unique,
} from 'typeorm';
import { Wallet } from 'src/wallets/entities/wallet.entity';

@Entity('customers')
@Unique(['document'])
@Unique(['email'])
export class Customer {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true }) document: string;

  @Column() fullName: string;

  @Column({ unique: true }) email: string;

  @Column() phone: string;

  @CreateDateColumn() createdAt: Date;

  @OneToOne(() => Wallet, (wallet) => wallet.customer)
  wallet: Wallet;
}
