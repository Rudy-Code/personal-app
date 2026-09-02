'use client'

import { useNavigate, useParams } from 'react-router-dom'

import { useJournalStore } from '../stores/useLifestyleStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Edit, Tag, Timer, ArrowRight, Trash } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { format, isValid } from 'date-fns'
import { pl } from 'date-fns/locale'
import { toast } from '@/components/ui/toast'

export const JournalDetails = () => {
	const journalCategories = useJournalStore(state => state.journalCategories)

	const navigate = useNavigate()
	const formatJournalDate = (date: Date) => (isValid(date) ? format(date, 'd LLL yyyy', { locale: pl }) : 'Brak daty')
	const { id } = useParams()

	const entries = useJournalStore(state => state.entries)
	const deleteEntry = useJournalStore(state => state.deleteEntry)
	const currentEntry = entries.find(e => e.id === id)

	function handleDeleteEntry() {
		if (currentEntry) {
			deleteEntry(currentEntry.id)
			toast.add({
				type: 'success',
				title: 'Wpis został usunięty.',
				description: `Wpis "${currentEntry.title}" został pomyślnie usunięty.`,
			})
			navigate('/lifestyle/journal/')
		} else {
			toast.add({
				type: 'error',
				title: 'Nie można usunąć wpisu.',
				description: 'Nie znaleziono wpisu do usunięcia.',
			})
		}
	}

	return (
		<div className="">
			<Card className="flex flex-col items-center justify-between rounded-xl p-4 sm:flex-row">
				<div className="flex items-center gap-1">
					<Button variant="ghost" type="button" href="/lifestyle/journal/">
						<ArrowLeft size={12} />
					</Button>
					<h2 className="text-secondary-foreground text-lg font-bold">Szczegóły wpisu</h2>
				</div>
				<div className="mt-2 flex flex-col gap-2 sm:mt-0 sm:flex-row">
					<Button href={`/lifestyle/journal/edit/${id}`}>
						<Edit className="mr-2 h-4 w-4" />
						Edytuj
					</Button>
					<Button variant="destructive" onClick={handleDeleteEntry}>
						<Trash className="mr-2 h-4 w-4" />
						Usuń
					</Button>
				</div>
			</Card>

			<Card className="hover:border-app-muted mt-4 flex h-full flex-col gap-4 px-4 py-6 transition-colors">
				{currentEntry ? (
					<>
						<h2 className="title text-secondary-foreground">{currentEntry.title}</h2>

						<div className="flex flex-col gap-2 text-sm">
							<div className="flex items-center gap-2">
								<Timer size={13} className="shrink-0" />
								<p className="text-muted-foreground">
									Stworzono: <span className="text-secondary-foreground/90">{currentEntry.createdAt}</span>
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Calendar size={13} className="shrink-0" />
								<p className="text-muted-foreground flex items-center gap-1">
									Data:
									<span className="text-secondary-foreground/90 flex items-center gap-1">
										{formatJournalDate(currentEntry.dateRange.from)}
										{currentEntry.dateRange.to && (
											<>
												<ArrowRight size={12} /> {formatJournalDate(currentEntry.dateRange.to)}
											</>
										)}
									</span>
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Tag size={13} className="shrink-0" />
								<p className="text-muted-foreground">Kategorie: </p>
								<div className="flex flex-wrap gap-2">
									{currentEntry.tags.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{currentEntry.tags.map(tagId => {
												const category = journalCategories.find(c => c.id === tagId)

												return (
													<span
														key={tagId}
														className="badge text-secondary-foreground bg-sidebar-accent flex items-center rounded-sm border border-indigo-500/30 px-2 py-0.5 transition-colors duration-300"
													>
														{category?.name ?? tagId}
													</span>
												)
											})}
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="flex-1 border-t border-zinc-700">
							<div className="prose prose-zinc prose-invert w-full max-w-full rounded-md p-4">
								<Markdown remarkPlugins={[remarkGfm]}>{currentEntry.content}</Markdown>
							</div>
						</div>
					</>
				) : (
					<div className="p-6 text-center text-red-500">Nie znaleziono wpisu.</div>
				)}
			</Card>
		</div>
	)
}
