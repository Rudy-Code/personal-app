import { create } from 'zustand'

interface UIState {
	isCommandOpen: boolean
	toggleCommand: () => void
	setCommandOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>(set => ({
	isCommandOpen: false,
	toggleCommand: () => set(state => ({ isCommandOpen: !state.isCommandOpen })),
	setCommandOpen: open => set({ isCommandOpen: open }),
}))
