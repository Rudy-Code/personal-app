import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useSpectatorStore } from '../stores/useSpectatorStore'

// Dynamiczne wczytanie adresu z .env z fallbackiem na localhost
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'

export function useSpectatorSocket(runnerId: string = 'rudy') {
	const updateState = useSpectatorStore(state => state.updateState)

	useEffect(() => {
		// 1. Łączymy się z serwerem
		const socket = io(SERVER_URL)

		// 2. Po nawiązaniu połączenia wbijamy do pokoju konkretnego biegacza
		socket.on('connect', () => {
			console.log('Połączono z serwerem WebSocket!')
			updateState({ isConnected: true, status: 'LIVE' })

			socket.emit('join_room', `runner:${runnerId}`)
		})

		// Obsługa utraty połączenia (np. jak serwer padnie, albo stracisz neta na telefonie)
		socket.on('disconnect', () => {
			console.warn('Rozłączono z serwerem WebSocket')
			updateState({ isConnected: false, status: 'OFFLINE' })
		})

		// 3. Nasłuchujemy na event z nowymi danymi
		socket.on('runner_update', (data: any) => {
			// Przyszła nowa paczka - aktualizujemy store, co natychmiast odświeża interfejs
			updateState({
				currentPosition: data.coordinates,
				hr: data.hr,
				pace: data.pace,
				distance: data.distance,
				time: data.time,
				mood: data.mood,
				pitstops: data.pitstops,
			})
		})

		// Sprzątanie po wyłączeniu komponentu
		return () => {
			socket.disconnect()
		}
	}, [runnerId, updateState])
}
