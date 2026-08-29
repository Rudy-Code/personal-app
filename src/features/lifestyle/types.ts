export interface LifestyleState {
	entries: JournalEntry[]
	journalCategories: string[]
	addEntry: (newEntry: JournalEntry) => void
	updateEntry: (id: string, updatedFields: Partial<JournalEntry>) => void
	deleteEntry: (id: string) => void
}

export interface JournalEntry {
	id: string
	title: string
	content: string
	tags: string[]
	dateRange: string
	createdAt: string
}
