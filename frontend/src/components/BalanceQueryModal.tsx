'use client';

import { useState, type FormEvent } from 'react';
import { X, Search, FileText, Phone, Wallet } from 'lucide-react';
import { useToastStore } from '../store/toastStore';
import { apiService } from '../services/api';

interface BalanceQueryModalProps {
  onClose: () => void
}

export const BalanceQueryModal = ({ onClose }: BalanceQueryModalProps) => {
  // Function to show a toast
  const showToast = useToastStore((state) => state.showToast);

  // Form state
  const [formData, setFormData] = useState({
    document: '',
    phone: '',
  });

  // Balance state
  const [balance, setBalance] = useState<number | null>(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Searched state
  const [searched, setSearched] = useState(false);

  // Function to handle the submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(false);

    try {
      const response = await apiService.getBalanceFromSpecificUser(formData);

      setBalance(Number(response.data.balance));
      setSearched(true);
      showToast('Balance retrieved successfully', 'success');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast(error?.message ?? 'An error occurred while trying to retrieve the balance', 'error');
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 rounded-lg p-2">
              <Search className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-dark">Consultar Saldo</h2>
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
                placeholder="123456789"
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
                placeholder="3001234567"
              />
            </div>
          </div>

          {searched && balance !== null && (
            <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5" />
                <p className="text-sm font-medium opacity-90">Saldo Disponible</p>
              </div>
              <p className="text-4xl font-bold">${balance}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cerrar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
