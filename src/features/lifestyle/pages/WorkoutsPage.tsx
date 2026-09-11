import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { Activity, Calendar, Plus, Timer } from 'lucide-react'

const weeklyPlan = [
	{
		id: 1,
		date: new Date('2026-09-07'),
		workouts: [
			{
				id: 1,
				activityType: 'strength',
				name: 'Trening siłowy',
				time: '18:00',
				duration: 60, // minutes
				notes: 'Skup się na nogach i plecach. Pamiętaj o rozgrzewce.',
			},
			{
				id: 2,
				activityType: 'cardio',
				name: 'Bieganie',
				time: '07:00',
				duration: 30,
				notes: 'Biegaj w umiarkowanym tempie. Pamiętaj o nawodnieniu.',
			},
		],
	},
	{
		id: 2,
		date: new Date('2026-09-08'),
		workouts: [
			{
				id: 3,
				activityType: 'yoga',
				name: 'Joga',
				time: '19:00',
				duration: 45,
				notes: 'Skup się na oddechu i rozciąganiu. Użyj maty do jogi.',
			},
		],
	},
	{
		id: 3,
		date: new Date('2026-09-09'),
		workouts: [
			{
				id: 4,
				activityType: 'stretching',
				name: 'Rozciąganie',
				time: '20:00',
				duration: 30,
				notes: 'Rozciągaj wszystkie grupy mięśni po treningu.',
			},
		],
	},
	{
		id: 4,
		date: new Date('2026-09-10'),
		workouts: [
			{
				id: 5,
				activityType: 'cardio',
				name: 'Jogging',
				time: '08:00',
				duration: 45,
				notes: 'Jogging w umiarkowanym tempie. Pamiętaj o nawodnieniu.',
			},
		],
	},
	{
		id: 5,
		date: new Date('2026-09-11'),
		workouts: [
			{
				id: 6,
				activityType: 'strength',
				name: 'Trening siłowy',
				time: '18:00',
				duration: 60,
				notes: 'Skup się na nogach i plecach. Pamiętaj o rozgrzewce.',
			},
		],
	},
	{
		id: 6,
		date: new Date('2026-09-12'),
		workouts: [
			{
				id: 7,
				activityType: 'cardio',
				name: 'Bieganie',
				time: '07:00',
				duration: 30,
				notes: 'Biegaj w umiarkowanym tempie. Pamiętaj o nawodnieniu.',
			},
		],
	},
	{
		id: 7,
		date: new Date('2026-09-13'),
		workouts: [
			{
				id: 8,
				activityType: 'strength',
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
			<div className="">{/* current streak etc */}</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
				<Card className="sm:col-span-2" variant="secondary">
					<div className="top border-app-muted/20 flex justify-between border-b pb-3">
						<div className="">
							<h2 className="text-lg font-semibold">Plan na ten tydzień</h2>
							<div className="flex items-center gap-2 text-sm text-zinc-600">
								<Calendar size={14} />
								<p>24.08 - 30.08</p>
							</div>
						</div>
						<Button>Zarządzaj planem</Button>
					</div>
					<div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 2xl:grid-cols-3">
						<Card className="rounded-md">
							<div className="top flex items-center justify-between">
								<div className="">
									<p className="text-muted-foreground text-xs tracking-wider uppercase">
										{weeklyPlan[0].date.toLocaleDateString('pl-PL', { weekday: 'long' })}
									</p>
									<p className="mt-1 text-3xl font-semibold text-zinc-400">
										{weeklyPlan[0].date.toLocaleDateString('pl-PL', { day: 'numeric' })}
									</p>
								</div>
								<div className="">
									<Button variant="secondary" size="icon" className="border border-zinc-600" aria-label="Dodaj trening">
										<Plus size={16} />
									</Button>
								</div>
							</div>
							<div className="items mt-6">
								<div className="item border-chart-1 bg-secondary/80 rounded-sm border-l-5 px-4 py-4">
									<p className="text-app-text/90 font-semibold">07:00</p>
									<div className="mt-3 space-y-3">
										<p className="text-app-text font-semibold">Poranne Bieganie</p>
										<div className="flex gap-2">
											<div className="flex items-center justify-center gap-2 rounded-lg border border-green-700 bg-green-900/50 px-2 py-0.5 text-sm text-green-500">
												<Activity size={14} />
												<p className="font-medium">Running</p>
											</div>
											<div className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-600/20 px-2 py-0.5 text-sm text-gray-400">
												<Timer size={14} />
												<p className="font-medium">45m</p>
											</div>
										</div>
										<div className="bg-app-elevated/70 mt-5 rounded-md border border-zinc-700 p-2 py-1.5">
											<p className="text-app-text/60 text-xs">
												30 minut biegania w umiarkowanym tempie. Pamiętaj o nawodnieniu.
											</p>
										</div>
									</div>
								</div>
							</div>
						</Card>
					</div>
				</Card>
			</div>
		</div>
	)
}

export default WorkoutsPage
