import { create } from "zustand";
import { persist } from "zustand/middleware"; 

interface AuthState {
  user: { name: string; email: string } | null;
  token: string | null;
  setAuth: (user: { name: string; email: string }, token: string) => void; 
  setUser: (user: { name: string; email: string } | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
