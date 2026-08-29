import { create } from 'zustand'
import type { LifestyleState } from '../types'
import { persist } from 'zustand/middleware'

export const useJournalStore = create<LifestyleState>()(
	persist(
		set => ({
			// TODO: CLEAN UP: Remove hardcoded entries
			entries: [
				{
					id: '1',
					title: 'Journal Entry 13: Reflections',
					content:
						"Today I reflected on my journey and the lessons I've learned along the way. Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, ea? Aliquam animi quaerat dolores sint neque. Eum accusamus laborum vero?",
					tags: ['Development'],
					dateRange: '25.08.2026 - 29.08.2026',
					createdAt: '29.08.2026',
				},
				{
					id: '2',
					title: 'Journal Entry 14: Sprint Retrospective & Architecture Fixes',
					content:
						'Reviewed the weekly release cycle. Refactored the core state management layer to avoid redundant re-renders across cards. Performance looks solid, but edge cases in offline sync still need attention.',
					tags: ['Work', 'Architecture'],
					dateRange: '18.08.2026 - 24.08.2026',
					createdAt: '24.08.2026',
				},
				{
					id: '3',
					title: 'Journal Entry 15: Deep Work & Focus Blocks',
					content:
						'Managed three uninterrupted four-hour deep work blocks this week. Shipped the entire settings module ahead of schedule. Need to keep distractions and unnecessary meetings to a minimum.',
					tags: ['Productivity', 'Personal'],
					dateRange: '10.08.2026 - 15.08.2026',
					createdAt: '15.08.2026',
				},
				{
					id: '4',
					title: 'Journal Entry 16: UI Redesign & Typography Clean-up',
					content:
						'Migrated the dashboard views to Tailwind v4. Replaced inconsistent custom spacing classes with standard tokens and polished dark mode contrast levels for long-form reading comfort.',
					tags: ['UI/UX', 'Design'],
					dateRange: '01.08.2026 - 08.08.2026',
					createdAt: '08.08.2026',
				},
				{
					id: '5',
					title: 'Journal Entry 17: Monthly Review & Goals Reset',
					content:
						'Summarized the key technical milestones of the past month. Set clear milestones for the next release: robust form validation, full markdown rendering, and local-first storage persistence.',
					tags: ['Planning', 'Review'],
					dateRange: '25.07.2026 - 31.07.2026',
					createdAt: '31.07.2026',
				},
			],
			journalCategories: [],

			addEntry: newEntry =>
				set(state => ({
					entries: [...state.entries, { ...newEntry, id: crypto.randomUUID() }],
				})),
			updateEntry: (id, updatedFields) =>
				set(state => ({
					entries: state.entries.map(entry => (entry.id === id ? { ...entry, ...updatedFields } : entry)),
				})),
			deleteEntry: id =>
				set(state => ({
					entries: state.entries.filter(entry => entry.id !== id),
				})),
		}),
		{
			name: 'lifestyle-storage',
		}
	)
)
