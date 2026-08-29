import ReactMarkdown from 'react-markdown'
import { Calendar, Tag, Timer } from 'lucide-react'
import type { JournalEntry } from '../../types'
import { Card } from '@/components/ui/Card'
import { NavLink } from 'react-router-dom'

export const JournalCard = ({ id, title, content, tags, dateRange, createdAt }: JournalEntry) => {
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
							{tags.map(tag => (
								<span
									key={tag}
									className="badge text-secondary-foreground bg-sidebar-accent flex items-center rounded-sm border border-indigo-500/30 px-2 py-0.5 transition-colors duration-300 group-hover:bg-indigo-500"
								>
									<Tag size={12} className="mr-1 shrink-0" />
									<span>{tag}</span>
								</span>
							))}
						</div>
					)}

					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<div className="flex items-center gap-1.5">
							<Calendar size={13} className="shrink-0" />
							<span>{dateRange}</span>
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
