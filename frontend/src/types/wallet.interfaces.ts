import type { IncomingOutgoingPayments, Transactions } from './payments.interfaces';

export interface BalanceResponse {
  customerId: number;
  walletId: number;
  balance: number | string;
  transactions: Transactions[];
  outgoingPayments: IncomingOutgoingPayments[];
  incomingPayments: IncomingOutgoingPayments[];
}
