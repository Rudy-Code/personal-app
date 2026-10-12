import { WeeklyPlan } from '../components/workouts/weekly-plan/WeeklyPlan'
import type { WorkoutDay } from '../types'

// TODO: ZUSTAND replace

const weeklyPlanData: WorkoutDay[] = [
	{
		id: 1,
		date: '2026-09-14',
		workouts: [
			{
				id: 1,
				activityType: 'strength',
				activityLabel: 'Trening siłowy',
				color: 'bg-blue-600',
				name: 'Trening siłowy',
				time: '18:00',
				duration: 60, // minutes
				notes: 'Skup się na nogach i plecach. Pamiętaj o rozgrzewce.',
			},
			{
				id: 2,
				activityType: 'cardio',
				activityLabel: 'Cardio',
				color: 'bg-emerald-600',
				name: 'Bieganie',
				time: '07:00',
				duration: 30,
				notes: 'Biegaj w umiarkowanym tempie. Pamiętaj o nawodnieniu.',
			},
		],
	},
	{
		id: 2,
		date: '2026-09-15',
		workouts: [
			{
				id: 3,
				activityType: 'yoga',
				activityLabel: 'Joga',
				color: 'bg-violet-600',
				name: 'Joga',
				time: '19:00',
				duration: 45,
				notes: 'Skup się na oddechu i rozciąganiu. Użyj maty do jogi.',
			},
		],
	},
	{
		id: 3,
		date: '2026-09-16',
		workouts: [
			{
				id: 4,
				activityType: 'stretching',
				activityLabel: 'Rozciąganie',
				color: 'bg-amber-600',
				name: 'Rozciąganie',
				time: '20:00',
				duration: 30,
				notes: 'Rozciągaj wszystkie grupy mięśni po treningu.',
			},
		],
	},
	{
		id: 4,
		date: '2026-09-17',
		workouts: [
			{
				id: 5,
				activityType: 'cardio',
				activityLabel: 'Cardio',
				color: 'bg-emerald-600',
				name: 'Jogging',
				time: '08:00',
				duration: 45,
				notes: 'Jogging w umiarkowanym tempie. Pamiętaj o nawodnieniu.',
			},
		],
	},
	{
		id: 5,
		date: '2026-09-18',
		workouts: [
			{
				id: 6,
				activityType: 'strength',
				activityLabel: 'Trening siłowy',
				color: 'bg-blue-600',
				name: 'Trening siłowy',
				time: '18:00',
				duration: 60,
				notes: 'Skup się na nogach i plecach. Pamiętaj o rozgrzewce.',
			},
		],
	},
	{
		id: 6,
		date: '2026-09-19',
		workouts: [
			{
				id: 7,
				activityType: 'cardio',
				activityLabel: 'Cardio',
				color: 'bg-emerald-600',
				name: 'Bieganie',
				time: '07:00',
				duration: 30,
				notes: 'Biegaj w umiarkowanym tempie. Pamiętaj o nawodnieniu.',
			},
		],
	},
	{
		id: 7,
		date: '2026-09-20',
		workouts: [
			{
				id: 8,
				activityType: 'strength',
				activityLabel: 'Trening siłowy',
				color: 'bg-blue-600',
				name: 'Trening siłowy',
				time: '18:00',
				duration: 60,
				notes: 'Skup się na nogach i plecach. Pamiętaj o rozgrzewce.',
			},
		],
	},
]

function WorkoutsPage() {
	return (
		<div className="flex flex-col px-4 py-6">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
				<WeeklyPlan days={weeklyPlanData} />
			</div>
		</div>
	)
}

export default WorkoutsPage
