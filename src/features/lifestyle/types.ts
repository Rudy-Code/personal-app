import type { colorType } from '@/types/colors'

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

// ==========

export type ActivityType = 'strength' | 'cardio' | 'yoga' | 'stretching'

export interface PlannedWorkout {
	id: number
	activityType: ActivityType
	activityLabel: string
	name: string
	color: colorType
	time: string
	duration: number
	notes?: string
}

export interface WorkoutDay {
	id: number
	date: string
	workouts: PlannedWorkout[]
}
