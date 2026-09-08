import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { transactionEffect } from '@/features/finance/utils/transactionEffect'
import { useFinanceStore } from '@/features/finance/stores/useFinanceStore'
import type { Transaction } from '@/features/finance/types'
import { documentsSchema, useDocumentsStore } from '@/features/documents/stores/useDocumentsStore'
import { MarkdownContent } from '@/components/markdown/MarkdownContent'
import { markdownUrl } from '@/components/markdown/markdown'
import { backupSchema, importFullBackup } from '@/lib/backup'
import { saveLocalImage } from '@/lib/localImages'

beforeEach(() => {
	localStorage.clear()
	useDocumentsStore.setState({ folders: [], pages: [], categories: [] })
	useFinanceStore.setState({ accounts: [], transactions: [] })
})

describe('edycja transakcji', () => {
	const transfer: Transaction = {
		id: 't1',
		type: 'transfer',
		accountId: 'a',
		toAccountId: 'b',
		amount: 80,
		date: '2026-09-07',
		description: 'Własny opis',
	}
	it('cofa wpływ transferu na obu kontach przy wyliczaniu dostępnej kwoty', () => {
		expect(20 - transactionEffect(transfer, 'a')).toBe(100)
		expect(80 - transactionEffect(transfer, 'b')).toBe(0)
		expect(transactionEffect(transfer, 'c')).toBe(0)
	})
	it('zastępuje transakcję bez duplikowania i czyści pola po zmianie typu', () => {
		useFinanceStore.setState({ transactions: [transfer] })
		useFinanceStore
			.getState()
			.updateTransaction('t1', { type: 'expense', amount: 50, toAccountId: undefined, categoryId: 'c2' })
		const result = useFinanceStore.getState().transactions
		expect(result).toHaveLength(1)
		expect(result[0]).toMatchObject({ id: 't1', type: 'expense', description: 'Własny opis' })
		expect(transactionEffect(result[0], 'a')).toBe(-50)
		expect(transactionEffect(result[0], 'b')).toBe(0)
		expect(JSON.parse(localStorage.getItem('finance-storage')!).state.transactions[0].toAccountId).toBeUndefined()
	})
})

describe('dokumenty', () => {
	it('zapisuje strony, zmienia folder i zachowuje treści po usunięciu folderu', () => {
		const store = useDocumentsStore.getState()
		const folder = store.addFolder('Firma'),
			page = store.addPage(null)
		store.updatePage(page, { title: 'Projekt', content: '# Plan', folderId: folder })
		store.renameFolder(folder, 'Moja firma')
		expect(useDocumentsStore.getState().folders[0].name).toBe('Moja firma')
		store.deleteFolder(folder)
		expect(useDocumentsStore.getState().pages[0]).toMatchObject({ content: '# Plan', folderId: null })
		expect(JSON.parse(localStorage.getItem('documents-storage')!).state.pages[0].title).toBe('Projekt')
		store.deletePage(page)
		expect(useDocumentsStore.getState().pages).toHaveLength(0)
	})
	it('nie zgłasza zapisu, jeśli przeglądarka odrzuci dane', () => {
		const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
			throw new Error('QuotaExceededError')
		})
		expect(() => useDocumentsStore.getState().addPage(null)).toThrow()
		expect(useDocumentsStore.getState().pages).toHaveLength(0)
		spy.mockRestore()
	})
})

describe('Markdown i lokalne zdjęcia', () => {
	it('renderuje kolory i GFM bez wykonywania HTML', () => {
		const html = renderToStaticMarkup(
			createElement(MarkdownContent, {
				children: '[**Ważne**](color:red)\n\n- [x] Gotowe\n\n<script>alert(1)</script>',
			})
		)
		expect(html).toContain('text-red-600')
		expect(html).toContain('<strong>Ważne</strong>')
		expect(html).toContain('type="checkbox"')
		expect(html).not.toContain('<script>')
	})
	it('dopuszcza tylko lokalne obrazy i bezpieczne odnośniki', () => {
		expect(markdownUrl('local-image:abc-123', 'src')).toBe('local-image:abc-123')
		for (const url of [
			'https://example.com/image.png',
			'data:image/svg+xml,test',
			'file:///photo.png',
			'//tracker.test/x',
		])
			expect(markdownUrl(url, 'src')).toBe('')
		expect(markdownUrl('javascript:alert(1)', 'href')).toBe('')
		expect(markdownUrl('color:unknown', 'href')).toBe('')
		expect(markdownUrl('https://example.com', 'href')).toBe('https://example.com')
	})
	it('odrzuca niedozwolone i za duże pliki przed zapisem', async () => {
		await expect(saveLocalImage(new File(['x'], 'x.svg', { type: 'image/svg+xml' }))).rejects.toThrow('Wybierz zdjęcie')
		await expect(
			saveLocalImage(new File([new Uint8Array(8 * 1024 * 1024 + 1)], 'x.png', { type: 'image/png' }))
		).rejects.toThrow('8 MB')
	})
})

describe('kopia zapasowa', () => {
	it('akceptuje starszą kopię dziennika bez dokumentów i obrazów', () => {
		expect(
			backupSchema.safeParse({ 'lifestyle-storage': { state: { entries: [], journalCategories: [] }, version: 1 } })
				.success
		).toBe(true)
	})
	it('odrzuca obcy folder i niebezpieczny typ obrazu', () => {
		const folder = useDocumentsStore.getState().addFolder('Firma')
		useDocumentsStore.getState().addPage(folder)
		const backup = { 'documents-storage': JSON.parse(localStorage.getItem('documents-storage')!) }
		expect(backupSchema.safeParse(backup).success).toBe(true)
		expect(
			backupSchema.safeParse({
				...backup,
				'local-images': [{ id: 'x', name: 'x', data: 'data:image/svg+xml;base64,AAAA' }],
			}).success
		).toBe(false)
		backup['documents-storage'].state.folders = []
		expect(backupSchema.safeParse(backup).success).toBe(false)
	})
	it('odrzuca uszkodzoną kopię przed modyfikacją danych', async () => {
		localStorage.setItem('documents-storage', 'oryginał')
		await expect(importFullBackup(new File(['{"finance-storage":{"state":{}}}'], 'bad.json'))).rejects.toThrow()
		expect(localStorage.getItem('documents-storage')).toBe('oryginał')
	})
})

describe('kategorie dokumentów', () => {
	it('odczytuje poprzedni format dokumentów bez utraty treści', () => {
		const data = documentsSchema.parse({
			folders: [],
			pages: [
				{
					id: 'old',
					folderId: null,
					title: 'Stara strona',
					content: '# Treść',
					createdAt: '2026-09-07',
					updatedAt: '2026-09-07',
				},
			],
		})
		expect(data.categories).toEqual([])
		expect(data.pages[0]).toMatchObject({ content: '# Treść', categoryIds: [] })
	})
	it('zachowuje kategorie przy zmianach folderów i usuwa tylko przypisania', () => {
		const store = useDocumentsStore.getState()
		store.addCategory({ name: 'Projekty', color: 'bg-blue-600' })
		const category = useDocumentsStore.getState().categories[0]
		const folder = store.addFolder('Firma'),
			page = store.addPage(folder)
		store.updatePage(page, { categoryIds: [category.id], content: 'Ważny dokument' })
		store.renameFolder(folder, 'Moja firma')
		store.updateCategory(category.id, { name: 'Zlecenia', color: 'bg-red-600' })
		const backup = backupSchema.parse({ 'documents-storage': JSON.parse(localStorage.getItem('documents-storage')!) })
		expect(backup['documents-storage']?.state.categories[0].name).toBe('Zlecenia')
		expect(backup['documents-storage']?.state.pages[0].categoryIds).toEqual([category.id])
		store.deleteCategory(category.id)
		expect(useDocumentsStore.getState().pages[0]).toMatchObject({
			id: page,
			content: 'Ważny dokument',
			folderId: folder,
			categoryIds: [],
		})
	})
	it('odrzuca duplikaty nazw i nieistniejące przypisania', () => {
		const store = useDocumentsStore.getState()
		store.addCategory({ name: 'Projekty', color: 'bg-blue-600' })
		expect(() => store.addCategory({ name: ' projekty ', color: 'bg-red-600' })).toThrow()
		const page = store.addPage(null)
		expect(() => store.updatePage(page, { categoryIds: ['missing'] })).toThrow()
		expect(useDocumentsStore.getState().pages[0].categoryIds).toEqual([])
	})
})
