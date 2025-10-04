export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export enum TransactionType {
  TOP_UP = 'TOP_UP',
  PURCHASE = 'PURCHASE',
  PAYMENT = 'PAYMENT',
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}
