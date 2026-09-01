import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/input'
import { CalendarIcon, ChevronDown, Plus, Search, X } from 'lucide-react'
import { JournalCard } from '../components/journal/JournalCard'
import { useJournalStore } from '../stores/useLifestyleStore'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format, startOfDay, endOfDay } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { pl } from 'date-fns/locale'

const ITEMS_PER_PAGE = 6

export const JournalPage = () => {
	const { entries, journalCategories } = useJournalStore()

	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [dateRange, setDateRange] = useState<DateRange | undefined>()

	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

	const filteredEntries = useMemo(() => {
		return entries.filter(entry => {
			const matchesSearch =
				searchQuery === '' ||
				entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				entry.content.toLowerCase().includes(searchQuery.toLowerCase())

			const matchesCategory = selectedCategory === 'all' || entry.tags.includes(selectedCategory)

			let matchesDate = true
			if (dateRange?.from) {
				const entryDate = new Date(entry.dateRange.from)

				if (dateRange.to) {
					matchesDate = entryDate >= startOfDay(dateRange.from) && entryDate <= endOfDay(dateRange.to)
				} else {
					matchesDate = entryDate.toDateString() === dateRange.from.toDateString()
				}
			}

			return matchesSearch && matchesCategory && matchesDate
		})
	}, [entries, searchQuery, selectedCategory, dateRange])

	const visibleEntries = filteredEntries.slice(0, visibleCount)

	return (
		<div className="flex flex-col gap-4">
			<Card className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
				<h2 className="text-secondary-foreground text-lg font-bold">Twój Dziennik</h2>

				<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
					<div className="relative w-full sm:w-64">
						<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
						<Input
							placeholder="Szukaj we wpisach..."
							value={searchQuery}
							onChange={e => {
								setSearchQuery(e.target.value)
								setVisibleCount(ITEMS_PER_PAGE)
							}}
							className="bg-background/40 border-zinc-600 pl-9 shadow-none focus:border-zinc-300! focus:ring-0!"
						/>
					</div>

					<Select
						value={selectedCategory}
						onValueChange={val => {
							setSelectedCategory(val ?? 'all')
							setVisibleCount(ITEMS_PER_PAGE)
						}}
					>
						<SelectTrigger className="w-full shrink-0 sm:w-45">
							<SelectValue placeholder="Wybierz kategorię" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="all">Wszystkie kategorie</SelectItem>
								{journalCategories.map(category => (
									<SelectItem key={category.id} value={category.name}>
										{category.name}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>

					<div className="flex w-full items-center gap-1 sm:w-auto">
						<Popover>
							<PopoverTrigger
								render={
									<Button
										variant="outline"
										className={cn(
											'w-full shrink-0 justify-start text-left font-normal sm:w-65',
											!dateRange && 'text-muted-foreground'
										)}
									>
										<CalendarIcon className="mr-2 size-4" />
										{dateRange?.from ? (
											dateRange.to ? (
												<>
													{format(dateRange.from, 'd LLL y', { locale: pl })} -{' '}
													{format(dateRange.to, 'd LLL y', { locale: pl })}
												</>
											) : (
												format(dateRange.from, 'd LLL y', { locale: pl })
											)
										) : (
											<span>Wybierz datę</span>
										)}
									</Button>
								}
							/>
							<PopoverContent className="w-auto p-0" align="end">
								<Calendar
									mode="range"
									defaultMonth={dateRange?.from}
									selected={dateRange}
									onSelect={range => {
										setDateRange(range)
										setVisibleCount(ITEMS_PER_PAGE)
									}}
									numberOfMonths={2}
									locale={pl}
								/>
							</PopoverContent>
						</Popover>

						{dateRange && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => {
									setDateRange(undefined)
									setVisibleCount(ITEMS_PER_PAGE)
								}}
								className="h-9 w-9 shrink-0"
								aria-label="Wyczyść datę"
							>
								<X className="size-4" />
							</Button>
						)}
					</div>

					<Button className="shrink-0" href="/lifestyle/journal/new">
						<Plus className="mr-2 size-4" />
						Nowy wpis
					</Button>
				</div>
			</Card>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
				{visibleEntries.length > 0 ? (
					visibleEntries.map(entry => <JournalCard key={entry.id} {...entry} />)
				) : (
					<div className="text-muted-foreground col-span-full py-12 text-center">
						Nie znaleziono wpisów dla podanych filtrów.
					</div>
				)}
			</div>

			{filteredEntries.length > visibleCount && (
				<div className="mt-2 flex justify-center">
					<Button size="lg" onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}>
						Wczytaj więcej wpisów
						<ChevronDown className="ml-2 size-4" />
					</Button>
				</div>
			)}
		</div>
	)
}
