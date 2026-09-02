import { create } from 'zustand'
import type { LifestyleState } from '../types'
import { createJSONStorage, persist } from 'zustand/middleware'

type PersistedJournalEntry = {
	dateRange?: unknown
	createdAt?: unknown
}

const toDate = (value: unknown) => {
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value
	}

	if (typeof value !== 'string') {
		return undefined
	}

	const polishDate = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
	if (polishDate) {
		return new Date(Number(polishDate[3]), Number(polishDate[2]) - 1, Number(polishDate[1]))
	}

	const date = new Date(value)
	return Number.isNaN(date.getTime()) ? undefined : date
}

const toDateRange = (dateRange: unknown, createdAt: unknown) => {
	if (typeof dateRange === 'string') {
		const [from, to] = dateRange.split(' - ')
		return { from: toDate(from) ?? toDate(createdAt) ?? new Date(), to: toDate(to) }
	}

	const range = dateRange as { from?: unknown; to?: unknown } | undefined
	return {
		from: toDate(range?.from) ?? toDate(createdAt) ?? new Date(),
		to: toDate(range?.to),
	}
}

export const useJournalStore = create<LifestyleState>()(
	persist(
		set => ({
			entries: [],
			journalCategories: [
				{ id: '1', name: 'Ważne', color: 'red' },
				{ id: '2', name: 'Trening', color: 'orange' },
				{ id: '3', name: 'Praca', color: 'blue-dark' },
				{ id: '4', name: 'Bieganie', color: 'emerald' },
				{ id: '5', name: 'Mecz', color: 'lime' },
				{ id: '6', name: 'Sędziowanie', color: 'amber' },
				{ id: '7', name: 'Rozwój Osobisty', color: 'indigo' },
				{ id: '8', name: 'Przemyślenia', color: 'violet' },
				{ id: '9', name: 'Wydarzenia', color: 'teal' },
			],

			addEntry: newEntry =>
				set(state => {
					const updatedEntries = [
						...state.entries,
						{
							...newEntry,
							id: crypto.randomUUID(),
							createdAt: new Date().toLocaleDateString('pl-PL'),
						},
					]

					updatedEntries.sort((a, b) => new Date(b.dateRange.from).getTime() - new Date(a.dateRange.from).getTime())

					return { entries: updatedEntries }
				}),
			updateEntry: (id, updatedFields) =>
				set(state => {
					const updatedEntries = state.entries.map(entry => (entry.id === id ? { ...entry, ...updatedFields } : entry))

					updatedEntries.sort((a, b) => new Date(b.dateRange.from).getTime() - new Date(a.dateRange.from).getTime())

					return { entries: updatedEntries }
				}),
			deleteEntry: id =>
				set(state => ({
					entries: state.entries.filter(entry => entry.id !== id),
				})),

			addCategory: newCategory =>
				set(state => {
					const updatedCategories = [
						...state.journalCategories,
						{
							...newCategory,
							id: crypto.randomUUID(),
						},
					]

					return { journalCategories: updatedCategories }
				}),
			updateCategory: (id, updatedFields) =>
				set(state => {
					const updatedCategories = state.journalCategories.map(category =>
						category.id === id ? { ...category, ...updatedFields } : category
					)

					return { journalCategories: updatedCategories }
				}),
			deleteCategory: categoryId =>
				set(state => ({
					journalCategories: state.journalCategories.filter(category => category.id !== categoryId),

					entries: state.entries.map(entry => ({
						...entry,
						tags: entry.tags.filter(tagId => tagId !== categoryId),
					})),
				})),
		}),
		{
			name: 'lifestyle-storage',
			version: 1,
			migrate: persistedState => {
				const state = persistedState as { entries?: PersistedJournalEntry[] }

				return {
					...state,
					entries: state.entries?.map(entry => ({
						...entry,
						dateRange: toDateRange(entry.dateRange, entry.createdAt),
					})),
				}
			},
			storage: createJSONStorage(() => localStorage, {
				reviver: (key, value) => {
					if ((key === 'from' || key === 'to') && typeof value === 'string') {
						const date = new Date(value)
						return Number.isNaN(date.getTime()) ? value : date
					}

					return value
				},
			}),
		}
	)
)
