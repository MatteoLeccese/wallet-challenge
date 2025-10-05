import { useState, type FormEvent } from 'react';
import { X, CheckCircle, Key } from 'lucide-react';
import { useToastStore } from '../store/toastStore';
import { apiService } from '../services/api';

interface ConfirmModalProps {
  type: 'purchase' | 'payment'
  onClose: () => void
  onSuccess: () => void
}

export const ConfirmModal = ({ type, onClose, onSuccess }: ConfirmModalProps) => {
  // Function to show a toast
  const showToast = useToastStore((state) => state.showToast);
  
  // Token state
  const [token, setToken] = useState<string>('');
  
  // SessionId state
  const [sessionId, setSessionId] = useState<number | null>(null);
  
  // Loading state
  const [loading, setLoading] = useState(false);

  // Function to handle the form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!sessionId || !token) {
      showToast('You must provide a valid session id and token', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = type === 'purchase'
        ? await apiService.confirmPurchaseTransaction({ sessionId, token })
        : await apiService.confirmPaymentTransaction({ sessionId, token });

      showToast(response?.message ?? 'Transaction confirmed', 'success');
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast(error?.message ?? 'Error while confirming the transaction', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-lg p-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-dark">Confirmar {type === 'purchase' ? 'Compra' : 'Pago'}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Session ID:</strong> {sessionId}
          </p>
          <p className="text-sm text-blue-800">
            Ingresa el token de 6 dígitos que fue enviado a tu email para confirmar la transacción.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Id de sesión</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                required
                minLength={1}
                value={sessionId ?? 0}
                onChange={(e) => setSessionId(Number(e.target.value))}
                className="input pl-10 text-center text-2xl tracking-widest font-bold"
                placeholder="000000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Código de 6 dígitos</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Token de Confirmación</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                className="input pl-10 text-center text-2xl tracking-widest font-bold"
                placeholder="000000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Código de 6 dígitos</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={loading || token.length !== 6} className="btn-primary flex-1">
              {loading ? 'Confirmando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
