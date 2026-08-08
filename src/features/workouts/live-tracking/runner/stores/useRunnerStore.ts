import { create } from 'zustand'

// Algorytm Haversine do wyliczania kilometrów z GPS
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
	const R = 6371 // Promień Ziemi w km
	const dLat = (lat2 - lat1) * (Math.PI / 180)
	const dLon = (lon2 - lon1) * (Math.PI / 180)
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
	return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

interface RunnerState {
	isTracking: boolean
	hr: number
	coordinates: { lat: number; lng: number } | null
	startTime: number | null
	endTime: number | null

	distance: number
	pace: string
	lastPosition: { lat: number; lng: number } | null

	mood: { text: string; timestamp: number } | null
	activePitstop: string | null
	completedPitstops: string[]
	pitstopStartTime: number | null
	totalPitstopTime: number

	startRun: () => void
	stopRun: () => void
	updateLocation: (lat: number, lng: number) => void
	updateHr: (hr: number) => void
	setMood: (moodText: string) => void
	togglePitstop: (pitstopName: string) => void
}

export const useRunnerStore = create<RunnerState>(set => ({
	isTracking: false,
	hr: 0,
	coordinates: null,
	startTime: null,
	endTime: null,
	distance: 0,
	pace: '-:--',
	lastPosition: null,
	mood: null,
	activePitstop: null,
	completedPitstops: [],
	pitstopStartTime: null,
	totalPitstopTime: 0,

	startRun: () =>
		set({
			isTracking: true,
			startTime: Date.now(),
			endTime: null,
			distance: 0,
			pace: '-:--',
			lastPosition: null,
			activePitstop: null,
			completedPitstops: [],
			pitstopStartTime: null,
			totalPitstopTime: 0,
			mood: null,
		}),

	stopRun: () =>
		set(state => {
			let extraPitstopTime = 0
			if (state.activePitstop && state.pitstopStartTime) {
				extraPitstopTime = Date.now() - state.pitstopStartTime
			}
			return {
				isTracking: false,
				endTime: Date.now(),
				activePitstop: null,
				totalPitstopTime: state.totalPitstopTime + extraPitstopTime,
				pitstopStartTime: null,
			}
		}),

	updateLocation: (lat, lng) =>
		set(state => {
			if (!state.isTracking) return { coordinates: { lat, lng } }

			let newDist = state.distance
			if (state.lastPosition) {
				newDist += calculateDistance(state.lastPosition.lat, state.lastPosition.lng, lat, lng)
			}

			let newPace = state.pace
			const now = Date.now()
			if (state.startTime) {
				const pitstopTime = state.totalPitstopTime + (state.pitstopStartTime ? now - state.pitstopStartTime : 0)
				const netTimeMs = now - state.startTime - pitstopTime

				// Obliczamy tempo po przebiegnięciu pierwszych 100 metrów
				if (newDist > 0.1 && netTimeMs > 0) {
					const paceDec = netTimeMs / 60000 / newDist
					const pM = Math.floor(paceDec)
					const pS = Math.floor((paceDec - pM) * 60)
						.toString()
						.padStart(2, '0')
					newPace = `${pM}:${pS}`
				}
			}
			return { coordinates: { lat, lng }, lastPosition: { lat, lng }, distance: newDist, pace: newPace }
		}),

	updateHr: hr => set({ hr }),
	setMood: text => set({ mood: { text, timestamp: Date.now() } }),

	togglePitstop: name =>
		set(state => {
			const now = Date.now()
			// 1 KLIKNIĘCIE: Wchodzimy do pitstopu (Czas netto się pauzuje)
			if (state.activePitstop !== name && !state.completedPitstops.includes(name)) {
				return {
					activePitstop: name,
					pitstopStartTime: now,
				}
			}
			// 2 KLIKNIĘCIE: Wychodzimy z pitstopu (Czas netto rusza dalej)
			if (state.activePitstop === name) {
				const addedTime = state.pitstopStartTime ? now - state.pitstopStartTime : 0
				return {
					activePitstop: null,
					pitstopStartTime: null,
					totalPitstopTime: state.totalPitstopTime + addedTime,
					completedPitstops: [...state.completedPitstops, name],
				}
			}
			return {}
		}),
}))
