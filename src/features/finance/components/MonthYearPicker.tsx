'use client'

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface MonthYearPickerProps {
	month: number
	year: number
	onChange: (month: number, year: number) => void
	className?: string
}

const MONTH_NAMES = [
	'Styczeń',
	'Luty',
	'Marzec',
	'Kwiecień',
	'Maj',
	'Czerwiec',
	'Lipiec',
	'Sierpień',
	'Wrzesień',
	'Październik',
	'Listopad',
	'Grudzień',
]

export const MonthYearPicker = ({ month, year, onChange, className }: MonthYearPickerProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [pickerYear, setPickerYear] = useState(year)

	const now = new Date()
	const currentRealMonth = now.getMonth() + 1
	const currentRealYear = now.getFullYear()
	const isCurrentPeriod = month === currentRealMonth && year === currentRealYear

	const handlePrevMonth = () => {
		if (month === 1) {
			onChange(12, year - 1)
		} else {
			onChange(month - 1, year)
		}
	}

	const handleNextMonth = () => {
		if (month === 12) {
			onChange(1, year + 1)
		} else {
			onChange(month + 1, year)
		}
	}

	const handleResetToday = () => {
		onChange(currentRealMonth, currentRealYear)
	}

	const handleSelectMonth = (mIndex: number) => {
		onChange(mIndex + 1, pickerYear)
		setIsOpen(false)
	}

	return (
		<div className={cn('flex flex-wrap items-center gap-2', className)}>
			<div className="border-border bg-card flex items-center rounded-xl border p-1 shadow-sm">
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg"
					onClick={handlePrevMonth}
					title="Poprzedni miesiąc"
				>
					<ChevronLeft className="size-4" />
				</Button>

				<Popover open={isOpen} onOpenChange={setIsOpen}>
					<PopoverTrigger
						render={
							<Button
								variant="ghost"
								className="text-foreground hover:bg-accent h-8 gap-2 px-3 font-mono text-sm font-semibold tracking-tight"
							>
								<CalendarIcon className="text-muted-foreground size-4" />
								<span>
									{MONTH_NAMES[month - 1]} {year}
								</span>
							</Button>
						}
					></PopoverTrigger>
					<PopoverContent className="w-64 p-3" align="start">
						<div className="border-border mb-3 flex items-center justify-between border-b pb-2">
							<Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPickerYear(prev => prev - 1)}>
								<ChevronsLeft className="size-4" />
							</Button>
							<span className="font-mono text-sm font-bold">{pickerYear}</span>
							<Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPickerYear(prev => prev + 1)}>
								<ChevronsRight className="size-4" />
							</Button>
						</div>

						<div className="grid grid-cols-3 gap-1.5">
							{MONTH_NAMES.map((name, index) => {
								const isSelected = month === index + 1 && year === pickerYear
								const isCurrent = currentRealMonth === index + 1 && currentRealYear === pickerYear

								return (
									<Button
										key={name}
										variant={isSelected ? 'default' : 'ghost'}
										size="sm"
										className={cn(
											'h-8 text-xs font-medium capitalize',
											!isSelected && isCurrent && 'border-primary/40 text-primary border font-bold',
											isSelected && 'bg-primary text-primary-foreground font-semibold'
										)}
										onClick={() => handleSelectMonth(index)}
									>
										{name.slice(0, 3)}
									</Button>
								)
							})}
						</div>
					</PopoverContent>
				</Popover>

				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg"
					onClick={handleNextMonth}
					title="Następny miesiąc"
				>
					<ChevronRight className="size-4" />
				</Button>
			</div>

			{/* SZYBKI POWRÓT DO DZISIAJ */}
			{!isCurrentPeriod && (
				<Button size="lg" variant="secondary" className="" onClick={handleResetToday}>
					Bieżący miesiąc
				</Button>
			)}
		</div>
	)
}
