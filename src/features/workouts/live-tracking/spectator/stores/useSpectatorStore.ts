import { create } from 'zustand'

interface SpectatorState {
	isConnected: boolean
	status: string
	currentPosition: [number, number] | null

	mood: { text: string; timestamp: number } | null
	pitstops: { active: string | null; completed: string[] }

	time: { startTime: number | null; endTime: number | null; totalPitstopTime: number; pitstopStartTime: number | null }
	hr: { current: number | string; average: number | string }
	pace: { current: string; average: string }
	distance: { covered: number | string; remaining: number | string }

	updateState: (data: Partial<SpectatorState>) => void
}

export const useSpectatorStore = create<SpectatorState>(set => ({
	isConnected: false,
	status: 'Oczekiwanie...',
	currentPosition: [49.968, 20.43],
	mood: null,
	pitstops: { active: null, completed: [] },
	time: { startTime: null, endTime: null, totalPitstopTime: 0, pitstopStartTime: null },
	hr: { current: '--', average: '--' },
	pace: { current: '-:--', average: '-:--' },
	distance: { covered: '--', remaining: '--' },

	updateState: data => set(state => ({ ...state, ...data })),
}))
