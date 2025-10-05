import type { IncomingOutgoingPayments, Transactions } from '../types/payments.interfaces';

// Function to unify transactions with confirmed incoming and outgoing  
export const unifyTransactions = (transactions: Transactions[] = [], incomingPayments: IncomingOutgoingPayments[] = [], outgoingPayments: IncomingOutgoingPayments[] = []) => {
  // Adding incoming and outgoing payments to the transactions
  let totalTransactions: Transactions[] = [];

  // Adding transactions if they exits
  if (transactions.length > 0) {
    totalTransactions = [...totalTransactions, ...transactions];
  }

  // Adding incoming payments if they exits
  if (incomingPayments.length > 0) {
    totalTransactions = [...totalTransactions, ...incomingPayments.flatMap((payment) => payment.status === 'CONFIRMED' ? ({
      id: payment.id,
      type: 'CREDIT',
      amount: payment.amount,
      referenceId: null,
      createdAt: payment.createdAt,
    }) : [])];
  }

  // Adding outgoing payments if they exits
  if (outgoingPayments.length > 0) {
    totalTransactions = [...totalTransactions, ...outgoingPayments.flatMap((payment) => payment.status === 'CONFIRMED' ? ({
      id: payment.id,
      type: 'PAYMENT',
      amount: payment.amount,
      referenceId: null,
      createdAt: payment.createdAt,
    }) : [])];
  }

  // If there are transactions we order them by createdAt
  if (totalTransactions.length > 0) {
    totalTransactions.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  // Return the combined transactions
  return totalTransactions;
};
