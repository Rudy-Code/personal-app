import { create } from 'zustand'
import { z } from 'zod'
import { COLORS } from '@/constants/colors'

export const documentCategorySchema = z.object({
	name: z.string().trim().min(1, 'Podaj nazwę kategorii.').max(32, 'Maksymalnie 32 znaki.'),
	color: z.string().refine(value => COLORS.some(c => c.bg === value), 'Wybierz kolor.'),
})

export const documentsSchema = z
	.object({
		categories: z.array(documentCategorySchema.extend({ id: z.string().min(1) })).default([]),
		folders: z.array(z.object({ id: z.string().min(1), name: z.string().trim().min(1).max(100) })),
		pages: z.array(
			z.object({
				id: z.string().min(1),
				categoryIds: z.array(z.string()).default([]),
				folderId: z.string().nullable(),
				title: z.string().max(200),
				content: z.string(),
				createdAt: z.string(),
				updatedAt: z.string(),
			})
		),
	})
	.superRefine((data, ctx) => {
		if (
			new Set(data.categories.map(c => c.id)).size !== data.categories.length ||
			new Set(data.categories.map(c => c.name.toLocaleLowerCase('pl'))).size !== data.categories.length ||
			data.pages.some(
				p =>
					new Set(p.categoryIds).size !== p.categoryIds.length ||
					p.categoryIds.some(id => !data.categories.some(c => c.id === id))
			) ||
			new Set(data.folders.map(f => f.id)).size !== data.folders.length ||
			new Set(data.pages.map(p => p.id)).size !== data.pages.length ||
			data.pages.some(p => p.folderId !== null && !data.folders.some(f => f.id === p.folderId))
		) {
			ctx.addIssue({ code: 'custom', message: 'Niepoprawna struktura dokumentów.' })
		}
	})
type DocumentsData = z.infer<typeof documentsSchema>
export type DocumentPage = DocumentsData['pages'][number]
export type DocumentCategory = DocumentsData['categories'][number]
const empty: DocumentsData = { folders: [], pages: [], categories: [] }
function readData(): DocumentsData {
	try {
		const raw = localStorage.getItem('documents-storage')
		return raw ? documentsSchema.parse(JSON.parse(raw).state) : empty
	} catch {
		return empty
	}
}
interface DocumentsState extends DocumentsData {
	addCategory: (category: Omit<DocumentCategory, 'id'>) => void
	updateCategory: (id: string, category: Omit<DocumentCategory, 'id'>) => void
	deleteCategory: (id: string) => void
	addFolder: (name: string) => string
	renameFolder: (id: string, name: string) => void
	deleteFolder: (id: string) => void
	addPage: (folderId: string | null) => string
	updatePage: (
		id: string,
		fields: Partial<Pick<DocumentPage, 'title' | 'content' | 'folderId' | 'categoryIds'>>
	) => void
	deletePage: (id: string) => void
}
export const useDocumentsStore = create<DocumentsState>((set, get) => {
	// Write before publishing state: a full storage must not masquerade as a successful save.
	function commit(data: Partial<DocumentsData>) {
		const validated = documentsSchema.parse({
			folders: get().folders,
			pages: get().pages,
			categories: get().categories,
			...data,
		})
		localStorage.setItem('documents-storage', JSON.stringify({ state: validated, version: 1 }))
		set(validated)
	}
	return {
		...readData(),
		addCategory: category => commit({ categories: [...get().categories, { ...category, id: crypto.randomUUID() }] }),
		updateCategory: (id, category) =>
			commit({ categories: get().categories.map(c => (c.id === id ? { ...c, ...category } : c)) }),
		deleteCategory: id =>
			commit({
				categories: get().categories.filter(c => c.id !== id),
				pages: get().pages.map(p => ({ ...p, categoryIds: p.categoryIds.filter(value => value !== id) })),
			}),
		addFolder: name => {
			const id = crypto.randomUUID()
			commit({ folders: [...get().folders, { id, name: name.trim() }], pages: get().pages })
			return id
		},
		renameFolder: (id, name) =>
			commit({ folders: get().folders.map(f => (f.id === id ? { ...f, name: name.trim() } : f)), pages: get().pages }),
		deleteFolder: id =>
			commit({
				folders: get().folders.filter(f => f.id !== id),
				pages: get().pages.map(p => (p.folderId === id ? { ...p, folderId: null } : p)),
			}),
		addPage: folderId => {
			const id = crypto.randomUUID(),
				now = new Date().toISOString()
			commit({
				folders: get().folders,
				pages: [
					...get().pages,
					{ id, folderId, categoryIds: [], title: 'Nowa strona', content: '', createdAt: now, updatedAt: now },
				],
			})
			return id
		},
		updatePage: (id, fields) =>
			commit({
				folders: get().folders,
				pages: get().pages.map(p => (p.id === id ? { ...p, ...fields, updatedAt: new Date().toISOString() } : p)),
			}),
		deletePage: id => commit({ folders: get().folders, pages: get().pages.filter(p => p.id !== id) }),
	}
})
