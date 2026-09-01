import ReactMarkdown from 'react-markdown'
import { Calendar, Tag, Timer } from 'lucide-react'
import { format, isValid } from 'date-fns'
import { pl } from 'date-fns/locale'
import type { JournalEntry } from '../../types'
import { Card } from '@/components/ui/Card'
import { NavLink } from 'react-router-dom'
import { useJournalStore as useLifestyleStore } from '../../stores/useLifestyleStore'

export const JournalCard = ({ id, title, content, tags, dateRange, createdAt }: JournalEntry) => {
	const journalCategories = useLifestyleStore(state => state.journalCategories)
	const formatJournalDate = (date: Date) => (isValid(date) ? format(date, 'd LLL yyyy', { locale: pl }) : 'Brak daty')

	return (
		<Card className="hover:border-app-muted group h-full py-6 transition-colors" isInteractive>
			<NavLink to={`/lifestyle/journal/${id}`} className="flex h-full flex-col justify-between">
				<div>
					<h2 className="text-accent-foreground line-clamp-1 font-semibold">{title}</h2>
					<div className="text-secondary-foreground/60 mt-2 line-clamp-2 text-sm">
						<ReactMarkdown>{content}</ReactMarkdown>
					</div>
				</div>

				<div className="text-muted-foreground mt-6 flex flex-col gap-3 text-xs">
					{tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{tags.map(categoryId => {
								const category = journalCategories.find(c => c.id === categoryId)
								return (
									<span
										key={categoryId}
										className="badge flex items-center rounded-sm border px-2 py-0.5 text-white transition-colors duration-300 group-hover:opacity-80"
										style={{
											backgroundColor: category?.color || '#888888',
											borderColor: category?.color || '#888888',
										}}
									>
										<Tag size={12} className="mr-1 shrink-0" />
										<span>{category?.name || categoryId}</span>
									</span>
								)
							})}
						</div>
					)}

					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<div className="flex items-center gap-1.5">
							<Calendar size={13} className="shrink-0" />
							<span>
								{formatJournalDate(dateRange.from)}
								{dateRange.to && ` - ${formatJournalDate(dateRange.to)}`}
							</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Timer size={13} className="shrink-0" />
							<span>Stworzono: {createdAt}</span>
						</div>
					</div>
				</div>
			</NavLink>
		</Card>
	)
}
