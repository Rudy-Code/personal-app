import { z } from 'zod'
import { documentsSchema } from '@/features/documents/stores/useDocumentsStore'
import { getLocalImages, putLocalImages } from './localImages'

export const APP_STORAGE_KEYS = ['lifestyle-storage', 'finance-storage', 'documents-storage'] as const
const id = z.string().min(1)
const financeSchema = z.object({
	accounts: z.array(
		z
			.object({
				id,
				name: z.string(),
				balance: z.number().finite(),
				icon: z.string(),
				color: z.string(),
				isArchived: z.boolean().optional(),
			})
			.passthrough()
	),
	categories: z.array(
		z.object({ id, name: z.string(), type: z.enum(['income', 'expense']), color: z.string() }).passthrough()
	),
	transactions: z.array(
		z.object({
			id,
			date: z.string().refine(v => !Number.isNaN(Date.parse(v))),
			description: z.string(),
			amount: z.number().finite().positive(),
			type: z.enum(['income', 'expense', 'transfer']),
			accountId: id,
			toAccountId: z.string().optional(),
			categoryId: z.string().optional(),
		})
	),
	settings: z.object({ monthlyExpenseLimit: z.number().finite(), monthlyIncomeGoal: z.number().finite() }),
})
const journalSchema = z.object({
	entries: z.array(
		z.object({
			id,
			title: z.string(),
			content: z.string(),
			tags: z.array(z.string()),
			createdAt: z.string(),
			dateRange: z.union([z.string(), z.object({ from: z.string(), to: z.string().optional() })]),
		})
	),
	journalCategories: z.array(z.object({ id, name: z.string(), color: z.string() })),
})
export const backupSchema = z
	.object({
		'finance-storage': z.object({ state: financeSchema, version: z.number().optional() }).optional(),
		'lifestyle-storage': z.object({ state: journalSchema, version: z.number().optional() }).optional(),
		'documents-storage': z.object({ state: documentsSchema, version: z.number().optional() }).optional(),
		'local-images': z
			.array(
				z.object({
					id: z.string().regex(/^[\w-]+$/),
					name: z.string(),
					data: z
						.string()
						.max(12 * 1024 * 1024)
						.regex(/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/),
				})
			)
			.optional(),
	})
	.refine(data => APP_STORAGE_KEYS.some(key => data[key]), 'Plik jest pusty lub ma zły format.')

export const getStorageBackup = (): Record<string, unknown> => {
	const backup: Record<string, unknown> = {}
	for (const key of APP_STORAGE_KEYS) {
		const raw = localStorage.getItem(key)
		if (raw) {
			try {
				backup[key] = JSON.parse(raw)
			} catch {
				// ignore malformed local entry
			}
		}
	}
	return backup
}

export const applyStorageBackup = (data: Record<string, unknown>): void => {
	for (const key of APP_STORAGE_KEYS) {
		if (data[key]) {
			localStorage.setItem(key, JSON.stringify(data[key]))
		}
	}
}

export const exportFullBackup = async () => {
	const backup = getStorageBackup()
	backup['local-images'] = await getLocalImages()
	const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }))
	const anchor = document.createElement('a')
	anchor.href = url
	anchor.download = `personal-hub-${new Date().toISOString().slice(0, 10)}.json`
	document.body.appendChild(anchor)
	anchor.click()
	anchor.remove()
	setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const importFullBackup = async (file: File): Promise<void> => {
	// Validate all data before writing. Missing sections in older backups are left intact.
	const imported = backupSchema.parse(JSON.parse(await file.text()))
	const previous = new Map(APP_STORAGE_KEYS.map(key => [key, localStorage.getItem(key)]))
	const previousImages = imported['local-images'] ? await getLocalImages() : undefined
	if (imported['local-images']) await putLocalImages(imported['local-images'])
	try {
		applyStorageBackup(imported)
	} catch (error) {
		for (const key of APP_STORAGE_KEYS) localStorage.removeItem(key)
		for (const [key, value] of previous) {
			if (value !== null) localStorage.setItem(key, value)
		}
		if (previousImages) await putLocalImages(previousImages)
		throw error
	}
	window.location.reload()
}
