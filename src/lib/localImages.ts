export interface LocalImage {
	id: string
	name: string
	data: string
}
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_IMAGE_SIZE = 8 * 1024 * 1024

function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('personal-hub-images', 1)
		request.onupgradeneeded = () => request.result.createObjectStore('images', { keyPath: 'id' })
		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
		request.onblocked = () => reject(new Error('Zamknij inne karty aplikacji i spróbuj ponownie.'))
	})
}

export async function getLocalImages(): Promise<LocalImage[]> {
	const db = await openDatabase()
	return new Promise((resolve, reject) => {
		const tx = db.transaction('images', 'readonly')
		const request = tx.objectStore('images').getAll()
		tx.oncomplete = () => {
			db.close()
			resolve(request.result)
		}
		tx.onabort = () => {
			db.close()
			reject(tx.error)
		}
	})
}

export async function getLocalImage(id: string): Promise<LocalImage | undefined> {
	const db = await openDatabase()
	return new Promise((resolve, reject) => {
		const tx = db.transaction('images', 'readonly')
		const request = tx.objectStore('images').get(id)
		tx.oncomplete = () => {
			db.close()
			resolve(request.result)
		}
		tx.onabort = () => {
			db.close()
			reject(tx.error)
		}
	})
}

export async function putLocalImages(images: LocalImage[]): Promise<void> {
	const db = await openDatabase()
	return new Promise((resolve, reject) => {
		const tx = db.transaction('images', 'readwrite')
		for (const image of images) tx.objectStore('images').put(image)
		tx.oncomplete = () => {
			db.close()
			resolve()
		}
		tx.onabort = () => {
			db.close()
			reject(tx.error ?? new Error('Nie udało się zapisać zdjęć.'))
		}
	})
}

export async function saveLocalImage(file: File): Promise<LocalImage> {
	if (!IMAGE_TYPES.includes(file.type)) throw new Error('Wybierz zdjęcie JPG, PNG, WebP lub GIF.')
	if (file.size > MAX_IMAGE_SIZE) throw new Error('Zdjęcie może mieć maksymalnie 8 MB.')
	const data = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(String(reader.result))
		reader.onerror = () => reject(new Error('Nie udało się odczytać zdjęcia.'))
		reader.readAsDataURL(file)
	})
	const image = { id: crypto.randomUUID(), name: file.name, data }
	await putLocalImages([image])
	return image
}
