import { useMemo, useState, type FormEvent } from 'react';
import { X, Plus, FileText, Phone, DollarSign } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

interface RechargeModalProps {
  onClose: () => void
  onSuccess: () => void
}

export const RechargeModal = ({ onClose, onSuccess }: RechargeModalProps) => {
  // User state
  const user = useAuthStore((state) => state.user);
  
  // Function to show a toast
  const showToast = useToastStore((state) => state.showToast);

  // Form state
  const [formData, setFormData] = useState({
    document: user?.document ?? '',
    phone: user?.phone ?? '',
    amount: 0,
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  // Handle submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.recharge({
        ...formData,
        amount: Number(formData.amount),
      });

      showToast(response.message ?? 'Top up successful!', 'success');
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast(error?.message ?? 'Error while trying top up', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isTopUpForAnotherUser = useMemo(() => {
    if (
      user && user.document && user.phone
      && user.document !== formData.document
      && user.phone !== formData.document
    ) {
      return true;
    }

    return false;
  }, [formData.document, user]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-dark">Recargar Billetera</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Documento</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Monto</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min={1}
                required
                value={Number(formData.amount)}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="input pl-10"
                placeholder="50"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Procesando...' : 'Recargar'}
            </button>
          </div>

          <div className="min-h-3">
            {isTopUpForAnotherUser && (
                <p className="block text-sm font-medium text-dark mb-2">
                  Está seguro/a que desea recargar a otra persona?
                </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
