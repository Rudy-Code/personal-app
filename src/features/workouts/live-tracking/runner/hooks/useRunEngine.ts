import { useRef, useCallback } from 'react'
import { useRunnerStore } from '../stores/useRunnerStore'

export function useRunEngine() {
	const { startRun, stopRun, updateLocation } = useRunnerStore()
	const watchIdRef = useRef<number | null>(null)
	const wakeLockRef = useRef<any>(null)

	const startTracking = useCallback(async () => {
		try {
			// 1. Blokada ekranu
			if ('wakeLock' in navigator) {
				wakeLockRef.current = await navigator.wakeLock.request('screen')
			}

			// 2. Odpalenie GPS
			if ('geolocation' in navigator) {
				watchIdRef.current = navigator.geolocation.watchPosition(
					position => {
						updateLocation(position.coords.latitude, position.coords.longitude)
					},
					err => console.error('Błąd GPS:', err),
					{ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
				)
			} else {
				alert('Brak GPS w przeglądarce!')
			}

			startRun()
		} catch (err) {
			console.error('Błąd startu silnika:', err)
		}
	}, [startRun, updateLocation])

	const stopTracking = useCallback(() => {
		if (watchIdRef.current !== null) {
			navigator.geolocation.clearWatch(watchIdRef.current)
		}
		if (wakeLockRef.current !== null) {
			wakeLockRef.current.release()
		}
		stopRun()
	}, [stopRun])

	return { startTracking, stopTracking }
}
