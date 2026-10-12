import { useState } from 'react'
import { addDays, addWeeks, format, isSameWeek, startOfWeek } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface WeekPickerProps {
	weekStart: Date
	onChange: (weekStart: Date) => void
}

export function WeekPicker({ weekStart, onChange }: WeekPickerProps) {
	const [isOpen, setIsOpen] = useState(false)
	const weekEnd = addDays(weekStart, 6)
	const isCurrentWeek = isSameWeek(weekStart, new Date(), { weekStartsOn: 1 })

	return (
		<div className="flex flex-wrap items-center gap-2">
			<div className="border-border bg-card flex items-center rounded-xl border p-1 shadow-sm">
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg"
					onClick={() => onChange(addWeeks(weekStart, -1))}
					aria-label="Poprzedni tydzień"
					title="Poprzedni tydzień"
				>
					<ChevronLeft className="size-4" />
				</Button>
				<Popover open={isOpen} onOpenChange={setIsOpen}>
					<PopoverTrigger
						render={
							<Button
								variant="ghost"
								className="text-foreground hover:bg-accent h-8 gap-2 px-2 font-mono text-xs font-semibold tracking-tight sm:px-3 sm:text-sm"
								aria-label="Wybierz tydzień"
							>
								<CalendarIcon className="text-muted-foreground size-4" />
								<span aria-live="polite" aria-atomic="true">
									{format(weekStart, weekStart.getFullYear() === weekEnd.getFullYear() ? 'dd.MM' : 'dd.MM.yyyy')} -{' '}
									{format(weekEnd, 'dd.MM.yyyy')}
								</span>
							</Button>
						}
					/>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="range"
							defaultMonth={weekStart}
							selected={{ from: weekStart, to: weekEnd }}
							weekStartsOn={1}
							onDayClick={date => {
								onChange(startOfWeek(date, { weekStartsOn: 1 }))
								setIsOpen(false)
							}}
						/>
					</PopoverContent>
				</Popover>
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg"
					onClick={() => onChange(addWeeks(weekStart, 1))}
					aria-label="Następny tydzień"
					title="Następny tydzień"
				>
					<ChevronRight className="size-4" />
				</Button>
			</div>
			{!isCurrentWeek && (
				<Button size="lg" variant="secondary" onClick={() => onChange(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
					Bieżący tydzień
				</Button>
			)}
		</div>
	)
}
