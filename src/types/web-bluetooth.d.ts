export {}

declare global {
	interface Navigator {
		bluetooth: Bluetooth
	}

	interface Bluetooth {
		requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>
	}

	interface RequestDeviceOptions {
		filters?: BluetoothLEScanFilter[]
		optionalServices?: BluetoothServiceUUID[]
		acceptAllDevices?: boolean
	}

	interface BluetoothLEScanFilter {
		services?: BluetoothServiceUUID[]
		name?: string
		namePrefix?: string
	}

	type BluetoothServiceUUID = string | number

	interface BluetoothDevice extends EventTarget {
		gatt?: BluetoothRemoteGATTServer | null
	}

	interface BluetoothRemoteGATTServer {
		connect(): Promise<BluetoothRemoteGATTServer>
		getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>
	}

	interface BluetoothRemoteGATTService {
		getCharacteristic(characteristic: BluetoothServiceUUID): Promise<BluetoothRemoteGATTCharacteristic>
	}

	interface BluetoothRemoteGATTCharacteristic extends EventTarget {
		startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
		addEventListener(
			type: 'characteristicvaluechanged',
			listener: (this: BluetoothRemoteGATTCharacteristic, ev: Event) => void
		): void
	}
}
