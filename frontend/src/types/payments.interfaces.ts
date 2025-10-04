export interface Transactions {
  id: number;
  type: string;
  amount: number | string;
  referenceId: number;
  createdAt: string;
}

export interface IncomingOutgoingPayments {
  id: number;
  status: string,
  amount: number | string,
  createdAt: string,
}
