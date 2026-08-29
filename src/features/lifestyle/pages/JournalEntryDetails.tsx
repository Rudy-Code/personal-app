import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { useParams } from 'react-router-dom'
import { useJournalStore } from '../stores/useLifestyleStore'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from '@/components/ui/toast'

export const JournalEntryDetails = () => {
	const { id } = useParams()
	const entry = useJournalStore(state => state.entries.find(e => e.id === id))
	const updateEntry = useJournalStore(state => state.updateEntry)

	const [content, setContent] = useState(entry?.content || '')

	if (!entry) {
		return <div className="p-6 text-center text-red-500">Nie znaleziono wpisu.</div>
	}

	function updateContent() {
		if (!id) return
		updateEntry(id, { content })
		toast.add({
			type: 'success',
			title: 'Pomyślnie zapisano wpis',
		})
	}

	return (
		<div>
			<Card className="flex flex-col items-center justify-between rounded-xl sm:flex-row">
				<div className="flex items-center gap-1">
					<Button variant="ghost" href="/lifestyle/journal/">
						<ArrowLeft size={12} />
					</Button>
					<h2 className="text-secondary-foreground text-lg font-bold">Edytuj wpis</h2>
				</div>
				<div className="mt-2 flex flex-col gap-2 sm:mt-0 sm:flex-row">
					<div className="relative w-full max-w-sm"></div>
					<Button onClick={updateContent}>
						<Save />
						Zapisz zmiany
					</Button>
				</div>
			</Card>
			<div className="mt-4">
				<Card className="hover:border-app-muted group flex h-full flex-col gap-2 py-6 transition-colors">
					<h2 className="text-accent-foreground line-clamp-1 text-2xl font-semibold">{entry.title}</h2>

					<div className="mt-2 border-y border-zinc-600 py-2">
						{/* categories multi select*/}
						{/* event date - range calendar */}
					</div>

					<div className="mt-4">
						<Tabs defaultValue="overview" className="space-y-4">
							<TabsList>
								<TabsTrigger value="overview">Edycja</TabsTrigger>
								<TabsTrigger value="analytics">Podgląd</TabsTrigger>
							</TabsList>
							<TabsContent value="overview">
								<div className="px-2">
									<Field>
										<FieldLabel htmlFor="textarea">Edytuj wpis (dostępny markdown)</FieldLabel>

										<Textarea
											id="textarea"
											placeholder="# Thoughts for today

Reflecting on today's activities. Felt productive during the morning session.

## Areas for Improvement
- Need to focus more on hydration.
- Taking short breaks is crucial.

**Tomorrow's priority:** Finishing the presentation."
											value={content}
											onChange={e => setContent(e.target.value)}
										/>
									</Field>
								</div>
							</TabsContent>
							<TabsContent value="analytics">
								<Card>
									<div className="prose prose-zinc prose-invert">
										<Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
									</div>
								</Card>
							</TabsContent>
						</Tabs>
						<Button onClick={updateContent} className="mt-4 ml-2">
							<Save />
							Zapisz zmiany
						</Button>
					</div>
				</Card>
			</div>
		</div>
	)
}
