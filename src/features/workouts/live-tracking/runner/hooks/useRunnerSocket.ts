import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useRunnerStore } from '../stores/useRunnerStore'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'

export function useRunnerSocket() {
	const socketRef = useRef<Socket | null>(null)
	const isTracking = useRunnerStore(state => state.isTracking)

	useEffect(() => {
		socketRef.current = io(SERVER_URL)
		return () => {
			socketRef.current?.disconnect()
		}
	}, [])

	const buildPayload = useCallback(() => {
		const state = useRunnerStore.getState()
		return {
			coordinates: state.coordinates ? [state.coordinates.lat, state.coordinates.lng] : null,
			hr: {
				current: state.hr || '--',
				average: state.averageHr || '--',
			},

			pace: { current: state.pace, average: state.averagePace },

			distance: { covered: state.distance.toFixed(2), remaining: Math.max(48 - state.distance, 0).toFixed(2) },
			time: {
				startTime: state.startTime,
				endTime: state.endTime,
				totalPitstopTime: state.totalPitstopTime,
				pitstopStartTime: state.pitstopStartTime,
			},
			mood: state.mood,
			pitstops: {
				active: state.activePitstop,
				completed: state.completedPitstops,
			},
		}
	}, [])

	useEffect(() => {
		if (!isTracking) return
		const interval = setInterval(() => {
			socketRef.current?.emit('send_update', buildPayload())
		}, 3000)
		return () => clearInterval(interval)
	}, [isTracking, buildPayload])

	const forceSync = () => {
		socketRef.current?.emit('send_update', buildPayload())
	}

	return { forceSync }
}
