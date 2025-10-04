import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Wallet, Plus, ShoppingCart, Send, History, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { apiService } from '../services/api';

export const Dashboard = () => {
  // Hook to navigate
  const navigate = useNavigate();

  // User and logout function from the store
  const { user, logout } = useAuthStore();

  // Function to show a toast
  const showToast = useToastStore((state) => state.showToast);

  // Balance state
  const [balance, setBalance] = useState<number | string>(0);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch balance function
  const fetchBalance = useCallback(async () => {
    try {
      const response = await apiService.getBalance();

      if (response.statusCode === 200) {
        setBalance(response.data.balance);
      }
    } catch {
      showToast('An error occurred trying to fetch the balance', 'success');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    showToast('User logged out successfully', 'success');
  };

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark">PayWallet</h1>
                <p className="text-sm text-gray-600">{user.names}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <div className="wallet-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/80 text-sm font-medium">Saldo Disponible</p>
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm"
            >
              <History className="w-4 h-4" />
              Historial
            </button>
          </div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded w-48 mb-2"></div>
            </div>
          ) : (
            <h2 className="text-5xl font-bold mb-2">${balance}</h2>
          )}
          <p className="text-white/80 text-sm">$ - Dolares</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => {}}
            className="card hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-200 rounded-xl p-3">
                <Plus className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-dark">Recargar</h3>
                <p className="text-sm text-gray-600">Añadir fondos</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {}}
            className="card hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 group-hover:bg-accent group-hover:scale-110 transition-all duration-200 rounded-xl p-3">
                <ShoppingCart className="w-6 h-6 text-accent group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-dark">Comprar</h3>
                <p className="text-sm text-gray-600">Realizar compra</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {}}
            className="card hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-200 rounded-xl p-3">
                <Send className="w-6 h-6 text-purple-600 group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-dark">Pagar</h3>
                <p className="text-sm text-gray-600">A otro usuario</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {}}
            className="card hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-200 rounded-xl p-3">
                <Search className="w-6 h-6 text-orange-600 group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-dark">Consultar</h3>
                <p className="text-sm text-gray-600">Saldo de otros</p>
              </div>
            </div>
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-dark mb-3">Información de Cuenta</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Documento:</span>
                <span className="font-semibold text-dark">{user.document}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold text-dark">{user.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Teléfono:</span>
                <span className="font-semibold text-dark">{user.phone}</span>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h3 className="text-lg font-semibold text-dark mb-3">Seguridad</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Todas tus transacciones están protegidas con confirmación por token de seguridad.
            </p>
            <div className="flex items-center gap-2 text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Cuenta verificada</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
