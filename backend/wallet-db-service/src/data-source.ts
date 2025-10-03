import { DataSource } from 'typeorm';
import { Customer } from './clients/entities/customer.entity';
import { Wallet } from './wallets/entities/wallet.entity';
import { Transaction } from './payments/entities/transaction.entity';
import { PaymentSession } from './payments/entities/payment-session.entity';
import { config } from 'dotenv';
config(); // Load environment variables

// Migrations
import { CreateCustomersTable1759436233133 } from './migrations/1759436233133-create-customers-table';
import { CreateWalletsTable1759436461419 } from './migrations/1759436461419-create-wallets-table';
import { CreateTransactionsTable1759436489769 } from './migrations/1759436489769-create-transactions-table';
import { CreatePaymentSessionsTable1759436518127 } from './migrations/1759436518127-create-payment-sessions-table';

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT ?? 3306),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [Customer, Wallet, Transaction, PaymentSession],
  migrations: [
    CreateCustomersTable1759436233133,
    CreateWalletsTable1759436461419,
    CreatePaymentSessionsTable1759436518127,
    CreateTransactionsTable1759436489769,
  ],
  synchronize: false,
  migrationsRun: true,
});
