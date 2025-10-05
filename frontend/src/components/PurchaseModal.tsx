import { useState, type FormEvent } from 'react';
import { X, ShoppingCart, DollarSign } from 'lucide-react';
import { useToastStore } from '../store/toastStore';
import { apiService } from '../services/api';

interface PurchaseModalProps {
  onClose: () => void
  onSuccess: () => void
}

export const PurchaseModal = ({ onClose, onSuccess }: PurchaseModalProps) => {
  // Function to show a toast
  const showToast = useToastStore((state) => state.showToast);

  // Amount state
  const [amount, setAmount] = useState('');

  // Loading state
  const [loading, setLoading] = useState(false);

  // Function to submit the form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.purchase({ amount: Number(amount) });

      showToast(response.message ?? 'We sent you an email with a token and session to confirm the purchase.', 'success');
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast(error?.message ?? 'An error occurred while trying to make the purchase', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 rounded-lg p-2">
              <ShoppingCart className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-dark">Realizar Compra</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Monto de la Compra</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                required
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input pl-10"
                placeholder="10000"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Se enviará un token de confirmación a tu email registrado. Deberás ingresarlo en el siguiente paso.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Procesando...' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
