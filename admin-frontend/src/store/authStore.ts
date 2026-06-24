import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  token: string | null;
  userInfo: User | null;
  isLoggedIn: boolean;
  setToken: (token: string) => void;
  setUserInfo: (info: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
  isLoggedIn: !!localStorage.getItem('token'),
  setToken: (token: string) => {
    localStorage.setItem('token', token);
    set({ token, isLoggedIn: true });
  },
  setUserInfo: (info: User) => {
    localStorage.setItem('userInfo', JSON.stringify(info));
    set({ userInfo: info });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    set({ token: null, userInfo: null, isLoggedIn: false });
  },
}));
