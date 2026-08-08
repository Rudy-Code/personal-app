import { useState, useCallback, useRef } from 'react'
import { useRunnerStore } from '../stores/useRunnerStore'

export function usePolarH10() {
	const [isConnected, setIsConnected] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const deviceRef = useRef<BluetoothDevice | null>(null)

	const updateHr = useRunnerStore(state => state.updateHr)

	const connectPolar = useCallback(async () => {
		try {
			setError(null)
			const device = await navigator.bluetooth.requestDevice({
				filters: [{ services: ['heart_rate'] }],
			})

			deviceRef.current = device
			const server = await device.gatt?.connect()
			const service = await server?.getPrimaryService('heart_rate')
			const characteristic = await service?.getCharacteristic('heart_rate_measurement')

			await characteristic?.startNotifications()
			setIsConnected(true)

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
			})
		} catch (err: any) {
			setError(err.message)
		}
	}, [updateHr])

	return { isConnected, connectPolar, error }
}
