import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Customer } from 'src/clients/entities/customer.entity';
import { DecimalTransformer } from 'src/common/decimal.transformer';
import { Transaction } from 'src/payments/entities/transaction.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid') id: string;

  @OneToOne(() => Customer, (customer) => customer.wallet)
  @JoinColumn()
  customer: Customer;

  @Column('decimal', {
    precision: 14,
    scale: 2,
    transformer: DecimalTransformer,
    default: 0,
  })
  balance: number;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];
}
