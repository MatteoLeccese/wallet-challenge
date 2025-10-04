import { create } from 'zustand';
import type { Toast, ToastType } from '../types/toast.interfaces';

interface ToastState {
  toasts: Toast[]
  showToast: (message: string, type: ToastType) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, type) => {
    // Making a random id for the toast
    const id = Math.random().toString(36).substring(7);
    
    // Making the toast object
    const toast: Toast = { id, message, type };

    // Adding the toast to the array
    set((state) => ({ toasts: [...state.toasts, toast] }));

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
