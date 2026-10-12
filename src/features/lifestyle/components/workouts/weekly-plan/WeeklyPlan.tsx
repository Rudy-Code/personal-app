import { Button } from '@/components/ui/button'
import type { WorkoutDay } from '@/features/lifestyle/types'
import { addDays, format, startOfWeek } from 'date-fns'
import { useState } from 'react'
import { WeekPicker } from './WeekPicker'
import { Card } from '@/components/ui/Card'
import { WorkoutDayCard } from './WorkoutDayCard'

export const WeeklyPlan = ({ days }: { days: WorkoutDay[] }) => {
	const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
	const visibleDays = Array.from({ length: 7 }, (_, index) => {
		const date = format(addDays(weekStart, index), 'yyyy-MM-dd')
		return days.find(day => day.date === date) ?? { date, workouts: [] }
	})

	return (
		<Card className="min-w-0 sm:col-span-2" variant="secondary">
			<div className="border-app-muted/20 flex flex-wrap items-center justify-between gap-3 border-b pb-3">
				<div className="flex min-w-0 flex-col gap-2">
					<h2 className="text-lg font-semibold">Plan tygodnia</h2>
					<WeekPicker weekStart={weekStart} onChange={setWeekStart} />
				</div>
				<Button disabled title="Zarządzanie będzie dostępne po podłączeniu edycji planu">
					Zarządzaj planem
				</Button>
			</div>
			<div className="grid grid-cols-1 items-stretch gap-4 pt-4 sm:grid-cols-2 2xl:grid-cols-3">
				{visibleDays.map(day => (
					<WorkoutDayCard key={day.date} day={day} />
				))}
			</div>
		</Card>
	)
}
