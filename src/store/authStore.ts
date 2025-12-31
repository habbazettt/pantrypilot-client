import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '@/types/auth';

interface AuthStore extends AuthState {
    setAuth: (token: string, user: User) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: () => { console.warn('login action deprecated in store, use setAuth') }, // legacy interface match
            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
                localStorage.removeItem('pantrypilot_session'); // Clear legacy session too
            },
            setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
            clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
