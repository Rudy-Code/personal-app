import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/input'
import { ChevronDown, Plus, Search } from 'lucide-react'
import { JournalCard } from '../components/journal/JournalCard'
import { useJournalStore } from '../stores/useLifestyleStore'

export const JournalPage = () => {
	const { entries } = useJournalStore()

	return (
		<div className="flex flex-col gap-4">
			<Card className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
				<h2 className="text-secondary-foreground text-lg font-bold">Twój Dziennik</h2>

				<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
					<div className="relative w-full sm:w-64">
						<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
						<Input
							placeholder="Szukaj we wpisach..."
							className="bg-background/40 border-zinc-600 pl-9 shadow-none focus:border-zinc-300! focus:ring-0!"
						/>
					</div>
					<Button className="shrink-0">
						<Plus className="mr-2 size-4" />
						Nowy wpis
					</Button>
				</div>
			</Card>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
				{entries.map(entry => (
					<JournalCard key={entry.id} {...entry} />
				))}
			</div>

			<div className="mt-2 flex justify-center">
				<Button size="lg">
					Wczytaj więcej wpisów
					<ChevronDown className="ml-2 size-4" />
				</Button>
			</div>
		</div>
	)
}
