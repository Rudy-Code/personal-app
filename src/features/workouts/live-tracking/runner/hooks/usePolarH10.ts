import { useState, useCallback, useRef } from 'react'
import { useRunnerStore } from '../stores/useRunnerStore'

export function usePolarH10() {
	const [isConnected, setIsConnected] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const deviceRef = useRef<BluetoothDevice | null>(null)

	const updateHr = useRunnerStore(state => state.updateHr)

	const connectPolar = useCallback(async () => {
		try {
			setError('Skanowanie...')
			const device = await navigator.bluetooth.requestDevice({
				filters: [{ services: ['heart_rate'] }],
			})

			deviceRef.current = device
			setError('Łączenie GATT...')

			const server = await device.gatt?.connect()

			// HACK DLA ANDROIDA: Dajemy chipowi 500ms na ustabilizowanie szyfrowania
			await new Promise(resolve => setTimeout(resolve, 500))

			setError('Pobieranie usługi...')
			const service = await server?.getPrimaryService('heart_rate')

			setError('Pobieranie charakterystyki...')
			const characteristic = await service?.getCharacteristic('heart_rate_measurement')

			setError('Start notyfikacji...')
			await characteristic?.startNotifications()

			setIsConnected(true)
			setError(null) // Czyścimy błąd po pełnym sukcesie

			characteristic?.addEventListener('characteristicvaluechanged', (event: any) => {
				const value: DataView = event.target.value
				const flags = value.getUint8(0)
				const is16Bit = flags & 0x01

				const currentHr = is16Bit ? value.getUint16(1, true) : value.getUint8(1)
				updateHr(currentHr)
			})

			device.addEventListener('gattserverdisconnected', () => {
				setIsConnected(false)
				updateHr(0)
				setError('Rozłączono z paskiem.')
			})
		} catch (err: any) {
			setIsConnected(false)
			setError(`Błąd BLE: ${err.message}`)
		}
	}, [updateHr])

	return { isConnected, connectPolar, error }
}
