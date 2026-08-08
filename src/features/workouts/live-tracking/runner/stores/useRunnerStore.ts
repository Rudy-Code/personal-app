import { create } from 'zustand'

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
	const R = 6371
	const dLat = (lat2 - lat1) * (Math.PI / 180)
	const dLon = (lon2 - lon1) * (Math.PI / 180)
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
	return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function formatPace(paceDec: number) {
	if (paceDec < 0 || paceDec > 30 || !isFinite(paceDec)) return '-:--'
	const pM = Math.floor(paceDec)
	const pS = Math.floor((paceDec - pM) * 60)
		.toString()
		.padStart(2, '0')
	return `${pM}:${pS}`
}

interface RunnerState {
	isTracking: boolean
	hr: number
	hrSum: number // NOWE: Suma tętna
	hrCount: number // NOWE: Ilość pomiarów
	averageHr: number // NOWE: Wyliczona średnia

	coordinates: { lat: number; lng: number } | null
	startTime: number | null
	endTime: number | null

	distance: number
	pace: string
	averagePace: string
	lastPosition: { lat: number; lng: number; timestamp: number } | null

	mood: { text: string; timestamp: number } | null
	activePitstop: string | null
	completedPitstops: string[]
	pitstopStartTime: number | null
	totalPitstopTime: number

	startRun: () => void
	stopRun: () => void
	resetRun: () => void
	updateLocation: (lat: number, lng: number) => void
	updateHr: (hr: number) => void
	setMood: (moodText: string) => void
	togglePitstop: (pitstopName: string) => void
}

export const useRunnerStore = create<RunnerState>(set => ({
	isTracking: false,
	hr: 0,
	hrSum: 0,
	hrCount: 0,
	averageHr: 0,
	coordinates: null,
	startTime: null,
	endTime: null,
	distance: 0,
	pace: '-:--',
	averagePace: '-:--',
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
			averagePace: '-:--',
			lastPosition: null,
			hr: 0,
			hrSum: 0,
			hrCount: 0,
			averageHr: 0, // Zerujemy tętno przy starcie
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

	resetRun: () =>
		set({
			isTracking: false,
			hr: 0,
			hrSum: 0,
			hrCount: 0,
			averageHr: 0,
			coordinates: null,
			startTime: null,
			endTime: null,
			distance: 0,
			pace: '-:--',
			averagePace: '-:--',
			lastPosition: null,
			mood: null,
			activePitstop: null,
			completedPitstops: [],
			pitstopStartTime: null,
			totalPitstopTime: 0,
		}),

	updateLocation: (lat, lng) =>
		set(state => {
			if (!state.isTracking) return { coordinates: { lat, lng } }

			const now = Date.now()
			let newDist = state.distance
			let newCurrentPace = state.pace
			let newAvgPace = state.averagePace

			if (state.lastPosition) {
				const tickDist = calculateDistance(state.lastPosition.lat, state.lastPosition.lng, lat, lng)
				newDist += tickDist
				const tickTimeMs = now - state.lastPosition.timestamp
				if (tickDist > 0.005 && tickTimeMs > 0) {
					newCurrentPace = formatPace(tickTimeMs / 60000 / tickDist)
				}
			}

			if (state.startTime) {
				const pitstopTime = state.totalPitstopTime + (state.pitstopStartTime ? now - state.pitstopStartTime : 0)
				const netTimeMs = now - state.startTime - pitstopTime
				if (newDist > 0.1 && netTimeMs > 0) {
					newAvgPace = formatPace(netTimeMs / 60000 / newDist)
				}
			}

			return {
				coordinates: { lat, lng },
				lastPosition: { lat, lng, timestamp: now },
				distance: newDist,
				pace: newCurrentPace,
				averagePace: newAvgPace,
			}
		}),

	updateHr: hr =>
		set(state => {
			if (hr === 0) return { hr: 0 } // Wyzerowanie przy rozłączeniu
			const newSum = state.hrSum + hr
			const newCount = state.hrCount + 1
			return {
				hr,
				hrSum: newSum,
				hrCount: newCount,
				averageHr: Math.round(newSum / newCount),
			}
		}),

	setMood: text => set({ mood: { text, timestamp: Date.now() } }),

	togglePitstop: name =>
		set(state => {
			const now = Date.now()
			if (state.activePitstop !== name && !state.completedPitstops.includes(name)) {
				return { activePitstop: name, pitstopStartTime: now }
			}
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
