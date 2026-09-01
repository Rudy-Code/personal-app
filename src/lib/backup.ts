const APP_STORAGE_KEYS = ['lifestyle-storage', 'finance-storage']

export const exportFullBackup = () => {
	const backup: Record<string, any> = {}

	APP_STORAGE_KEYS.forEach(key => {
		const rawData = localStorage.getItem(key)
		if (rawData) {
			backup[key] = JSON.parse(rawData)
		}
	})

	const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backup, null, 2))}`
	const anchor = document.createElement('a')
	anchor.href = jsonString
	anchor.download = `moje-dane-backup-${new Date().toISOString().slice(0, 10)}.json`
	document.body.appendChild(anchor)
	anchor.click()
	anchor.remove()
}

export const importFullBackup = (file: File): Promise<void> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.onload = event => {
			try {
				const importedData = JSON.parse(event.target?.result as string)
				let dataFound = false

				APP_STORAGE_KEYS.forEach(key => {
					if (importedData[key]) {
						localStorage.setItem(key, JSON.stringify(importedData[key]))
						dataFound = true
					}
				})

				if (!dataFound) {
					throw new Error('Plik jest pusty lub ma zły format.')
				}

				window.location.reload()
				resolve()
			} catch (error) {
				reject(error)
			}
		}

		reader.onerror = () => reject(new Error('Nie udało się odczytać pliku.'))
		reader.readAsText(file)
	})
}
