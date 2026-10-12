import { useEffect, useRef } from 'react'
import { useAuthStore } from '@stores/useAuthStore'
import { dataPut } from '@/lib/api'
import { getStorageBackup } from '@/lib/backup'

const AUTO_SAVE_INTERVAL_MS = 15_000

export function useCloudAutoSave() {
	const { token, isAuthenticated } = useAuthStore()
	const lastSyncedRef = useRef<string>('')
	const isSyncingRef = useRef(false)

	useEffect(() => {
		if (!isAuthenticated || !token) return

		lastSyncedRef.current = JSON.stringify(getStorageBackup())

		const syncIfChanged = async () => {
			if (isSyncingRef.current) return

			const backup = getStorageBackup()
			if (Object.keys(backup).length === 0) return

			const serialized = JSON.stringify(backup)
			if (serialized === lastSyncedRef.current) return

			isSyncingRef.current = true
			try {
				await dataPut(token, backup)
				lastSyncedRef.current = serialized
			} catch (err) {
				console.warn('[AutoSave] Błąd synchronizacji z chmurą:', err)
			} finally {
				isSyncingRef.current = false
			}
		}

		const handleStorageEvent = () => {
			void syncIfChanged()
		}
		window.addEventListener('storage', handleStorageEvent)

		const intervalId = setInterval(() => {
			void syncIfChanged()
		}, AUTO_SAVE_INTERVAL_MS)

		return () => {
			window.removeEventListener('storage', handleStorageEvent)
			clearInterval(intervalId)
		}
	}, [isAuthenticated, token])
}
