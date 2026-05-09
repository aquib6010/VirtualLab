/**
 * Auth Store — JWT token and user session management
 */
import { create } from 'zustand';

interface User {
  _id: string;
  email: string;
  displayName: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('vlab_token', token);
    localStorage.setItem('vlab_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('vlab_token');
    localStorage.removeItem('vlab_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('vlab_token');
    const userStr = localStorage.getItem('vlab_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('vlab_token');
        localStorage.removeItem('vlab_user');
      }
    }
  },
}));
