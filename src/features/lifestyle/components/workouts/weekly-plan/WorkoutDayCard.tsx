import { Button } from '@/components/ui/button'
import type { WorkoutDay } from '@/features/lifestyle/types'
import { format, parseISO } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { WorkoutCard } from './WorkoutCard'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export const WorkoutDayCard = ({ day }: { day: Pick<WorkoutDay, 'date' | 'workouts'> }) => {
	const dateNow = new Date()

	const date = parseISO(day.date)
	const workouts = [...day.workouts].sort((a, b) => a.time.localeCompare(b.time))

	const isToday = format(dateNow, 'yyyy-MM-dd') === day.date

	return (
		<Card className={cn('h-full min-w-0 gap-4 rounded-md')}>
			<div className="flex items-center justify-between gap-3">
				<div>
					<h3 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
						{format(date, 'EEEE', { locale: pl })}
					</h3>
					<time
						dateTime={day.date}
						className={cn(
							'text-secondary-foreground mt-1 block text-3xl font-semibold tabular-nums',
							isToday && 'text-primary'
						)}
					>
						{format(date, 'd')}
						<span className="text-muted-foreground ml-2 text-sm font-normal">
							{format(date, 'LLL', { locale: pl })}
						</span>
					</time>
				</div>
				<Button
					variant="secondary"
					size="icon"
					className="border border-zinc-600"
					aria-label={`Dodaj trening na ${format(date, 'd MMMM', { locale: pl })}`}
					title="Dodaj trening"
				>
					<Plus size={16} />
				</Button>
			</div>
			<div className="flex flex-col gap-3">
				{workouts.length > 0 ? (
					workouts.map(workout => <WorkoutCard key={workout.id} workout={workout} />)
				) : (
					<p className="text-muted-foreground flex flex-1 items-center justify-center py-6 text-center text-sm">
						REST DAY - brak zaplanowanych treningów
					</p>
				)}
			</div>
		</Card>
	)
}
