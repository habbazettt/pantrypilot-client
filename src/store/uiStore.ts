import { create } from 'zustand';

interface UIState {
    isOnboardingOpen: boolean;
    setOnboardingOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isOnboardingOpen: false,
    setOnboardingOpen: (open) => set({ isOnboardingOpen: open }),
}));
