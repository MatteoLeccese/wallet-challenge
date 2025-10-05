import type { IncomingOutgoingPayments, Transactions } from './payments.interfaces';

export interface BalanceResponse {
  customerId: number;
  walletId: number;
  balance: number | string;
  transactions: Transactions[];
  outgoingPayments: IncomingOutgoingPayments[];
  incomingPayments: IncomingOutgoingPayments[];
}

export interface TopUpWalletData {
  document: string;
  phone: string;
  amount: number;
}

export interface TopUpWalletResponse {
  message?: string;
  customerId: number;
  walletId: number;
  newBalance: number | string;
  transactionId: number;
}

export interface SpecificBalanceData {
  document: string;
  phone: string;
}

export interface SpecificBalanceResponse {
  message?: string;
  customerId: number;
  walletId: number;
  balance: number | string;
  transactions: Transactions[];
}
