import { X, History, ArrowUpRight, ArrowDownLeft, ShoppingCart, RefreshCw } from 'lucide-react';
import type { Transactions } from '../types/payments.interfaces';

interface TransactionHistoryProps {
  onClose: () => void
  transactions: Transactions[]
}

const getIcon = (type: string) => {
  switch (type) {
    case 'TOP_UP':
      return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
    case 'PURCHASE':
      return <ShoppingCart className="w-5 h-5 text-blue-600" />;
    case 'PAYMENT':
      return <ArrowUpRight className="w-5 h-5 text-red-600" />;
    case 'CREDIT':
      return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
    default:
      return <RefreshCw className="w-5 h-5 text-gray-600" />;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case 'TOP_UP':
    case 'CREDIT':
      return 'text-green-600';
    case 'PURCHASE':
      return 'text-blue-600';
    case 'PAYMENT':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export const TransactionHistory = ({ onClose, transactions }: TransactionHistoryProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <History className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-dark">Historial de Transacciones</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay transacciones registradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">{getIcon(transaction.type)}</div>
                      <div>
                        <p className="font-semibold text-dark capitalize">{transaction.type}</p>
                        <p className="text-sm text-gray-500">{new Date(transaction.createdAt).toISOString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${getColor(transaction.type)}`}>
                        {transaction.type === 'PAYMENT' || transaction.type === 'PURCHASE' ? '-' : '+'}${transaction.amount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button onClick={onClose} className="btn-primary w-full">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
