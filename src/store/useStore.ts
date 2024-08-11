import { create } from 'zustand'

interface AppState {
  user: null | { id: string; name: string }
  setUser: (user: { id: string; name: string } | null) => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))