export interface LifestyleState {
	entries: JournalEntry[]
	journalCategories: Category[]
	addEntry: (newEntry: NewJournalEntry) => void
	updateEntry: (id: string, updatedFields: Partial<JournalEntry>) => void
	deleteEntry: (id: string) => void

	addCategory: (newCategory: Omit<Category, 'id'>) => void
	updateCategory: (id: string, updatedFields: Partial<Category>) => void
	deleteCategory: (id: string) => void
}

interface Category {
	id: string
	name: string
	color: string
}
export interface JournalEntry {
	id: string
	title: string
	content: string
	tags: string[]
	dateRange: {
		from: Date
		to: Date | undefined
	}
	createdAt: string
}

export type NewJournalEntry = Omit<JournalEntry, 'id' | 'createdAt'>
