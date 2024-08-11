import {create }from 'zustand';

interface AuthState {
  user: null | { id: string; name: string; email: string };
  setUser: (user: { id: string; name: string; email: string } | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));