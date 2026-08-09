import { create } from "zustand";

interface AuthState {
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
