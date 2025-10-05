import { useState, type FormEvent } from 'react';
import { X, Send, DollarSign, FileText, Phone } from 'lucide-react';
import { apiService } from '../services/api';
import { useToastStore } from '../store/toastStore';

interface PaymentModalProps {
  onClose: () => void
  onSuccess: () => void
}

export const PaymentModal = ({ onClose, onSuccess }: PaymentModalProps) => {
  // Function to show a toast
  const showToast = useToastStore((state) => state.showToast);

  // Form state
  const [formData, setFormData] = useState({
    toDocument: '',
    toPhone: '',
    amount: 0,
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  // Function to submit the form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.payment({
        ...formData,
        amount: Number(formData.amount),
      });

      showToast(response?.message ?? 'We sent you an email with a token and session to confirm the payment.', 'success');
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast(error?.message ?? 'An error occurred while trying to make the payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-lg p-2">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-dark">Pagar a Usuario</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Monto a Pagar</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                required
                min={1}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="input pl-10"
                placeholder="10000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Documento del Destinatario</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.toDocument}
                onChange={(e) => setFormData({ ...formData, toDocument: e.target.value })}
                className="input pl-10"
                placeholder="987654321"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Teléfono del Destinatario</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                required
                value={formData.toPhone}
                onChange={(e) => setFormData({ ...formData, toPhone: e.target.value })}
                className="input pl-10"
                placeholder="3009876543"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Se enviará un token de confirmación a tu email. Deberás ingresarlo en el siguiente paso.
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
