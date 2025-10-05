import api from '../api/axios';
import type { ApiResponse } from '../types/api-response';
import type { ConfirmTransactionData, ConfirmTransactionResponse, InitiatePaymentData, InitiatePaymentResponse, InitiatePurchaseData, InitiatePurchaseResponse } from '../types/payments.interfaces';
import type { LoginData, LoginResponse, RegisterData, RegisterResponse } from '../types/user.interfaces';
import type { BalanceResponse, SpecificBalanceData, SpecificBalanceResponse, TopUpWalletData, TopUpWalletResponse } from '../types/wallet.interfaces';

export const apiService = {
  // Register client
  register: async (data: RegisterData): Promise<ApiResponse<RegisterResponse>> => {
    return await api.post('/auth/register', data);
  },

  // Login client
  login: async (data: LoginData): Promise<ApiResponse<LoginResponse>> => {
    return await api.post('/auth/login', data);
  },

  // Check user balance
  getBalance: async (): Promise<ApiResponse<BalanceResponse>> => {
    return await api.get('/wallets/balance');
  },

  // Top up wallet
  recharge: async (data: TopUpWalletData): Promise<ApiResponse<TopUpWalletResponse>> => {
    return await api.post('/wallets/top-up', data);
  },

  // Initiate purchase
  purchase: async (data: InitiatePurchaseData): Promise<ApiResponse<InitiatePurchaseResponse>> => {
    return await api.post('/payments/initiate-purchase', data);
  },

  // Confirm purchase transaction
  confirmPurchaseTransaction: async (data: ConfirmTransactionData): Promise<ApiResponse<ConfirmTransactionResponse>> => {
    return await api.post('/payments/confirm-purchase', data);
  },

  // Initiate payment
  payment: async (data: InitiatePaymentData): Promise<ApiResponse<InitiatePaymentResponse>> => {
    return await api.post('/payments/initiate-payment', data);
  },

  // Confirm payment transaction
  confirmPaymentTransaction: async (data: ConfirmTransactionData): Promise<ApiResponse<ConfirmTransactionResponse>> => {
    return await api.post('/payments/confirm-payment', data);
  },

  // Check balance from specific user
  getBalanceFromSpecificUser: async (data: SpecificBalanceData): Promise<ApiResponse<SpecificBalanceResponse>> => {
    return await api.post('/wallets/balance/specific', data);
  },

};
