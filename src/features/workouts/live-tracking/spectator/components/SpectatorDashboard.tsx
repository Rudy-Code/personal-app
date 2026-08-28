import { useState, useEffect, useMemo } from 'react'
import { gpx } from '@tmcw/togeojson'

import { MapRenderer } from './MapRenderer'
import Container from '@components/ui/Container'
import { PaceCard } from './PaceCard'
import { DistanceCard } from './DistanceCard'
import { TimeStatsCard } from './TimeStatsCard'
import { HeartRateCard } from './HeartRateCard'
import { MoodInfo } from './MoodInfo'

import { useSpectatorStore } from '../stores/useSpectatorStore'
import { useSpectatorSocket } from '../hooks/useSpectatorSocket'
import { CheckCircleIcon, MapPinIcon } from '@phosphor-icons/react'
import { StartInfoComponent } from './StartInfoComponent'

type Waypoint = {
	id: number
	name: string
	coords: [number, number]
}

export function SpectatorDashboard() {
	// 1. Odpalamy nasłuchiwacz Socket.io (działa w tle)
	useSpectatorSocket('rudy')

	// 2. Ciągniemy żywe dane ze Store'a
	const { currentPosition, status, isConnected, time, hr, pace, distance, mood, pitstops } = useSpectatorStore()

	const [routeGeoJson, setRouteGeoJson] = useState<any | null>(null)
	const EVENT_NAME = 'Ultra 48km'

	// 3. Wczytywanie GPX
	useEffect(() => {
		fetch('/Ultra-1.gpx')
			.then(response => {
				if (!response.ok) throw new Error('Nie znaleziono pliku GPX')
				return response.text()
			})
			.then(gpxText => {
				const parser = new DOMParser()
				const xml = parser.parseFromString(gpxText, 'text/xml')
				setRouteGeoJson(gpx(xml))
			})
			.catch(error => console.error('Błąd ładowania GPX:', error))
	}, [])

	// 4. Magia - wyciągamy punkty (sklepy/przepaki) z pliku GPX do naszej listy na dole
	const waypoints = useMemo<Waypoint[]>(() => {
		if (!routeGeoJson) return []
		// Filtrujemy tylko elementy typu Point z GeoJSON (czyli tagi <wpt> z GPX)
		return routeGeoJson.features
			.filter((feature: any) => feature.geometry.type === 'Point')
			.map((feature: any, index: number) => ({
				id: index,
				name: feature.properties.name || 'Punkt kontrolny',
				coords: feature.geometry.coordinates, // [lng, lat]
			}))
	}, [routeGeoJson])

	return (
		<div className="bg-app-bg text-app-text flex h-full w-full flex-col overflow-hidden font-sans">
			{/* SEKCJA MAPY */}
			<div className="relative z-0 h-100 w-full overflow-hidden md:h-240 md:rounded-xl">
				<MapRenderer currentPosition={currentPosition} routeGeoJson={routeGeoJson} />

				<div className="pointer-events-none absolute top-0 right-0 left-0 z-400 flex justify-between bg-linear-to-b from-black/80 to-transparent p-4">
					<span className="text-sm font-black tracking-widest text-white uppercase">{EVENT_NAME}</span>
					<div className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-black/60 px-2.5 py-1 backdrop-blur-md">
						{/* Kropka zmienia kolor jak tracisz zasięg */}
						<div className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-live animate-pulse' : 'bg-hr'}`}></div>
						<span className={`text-[9px] font-black tracking-widest ${isConnected ? 'text-live' : 'text-hr'}`}>
							{status}
						</span>
					</div>
				</div>
			</div>

			{/* do startu */}
			<StartInfoComponent />

			{/* SEKCJA STATYSTYK Z ŻYWYMI DANYMI */}
			<div className="stats py-6">
				<Container className="flex flex-col gap-3 px-4">
					<TimeStatsCard timeData={time} />
					<HeartRateCard currentHr={hr.current} avgHr={hr.average} />
					<div className="grid grid-cols-2 gap-2">
						<PaceCard currentPace={pace.current} avgPace={pace.average} />
						<DistanceCard covered={distance.covered} remaining={distance.remaining} />
					</div>
					{mood && <MoodInfo moodData={mood} />}
				</Container>
			</div>

			{/* SEKCJA PUNKTÓW */}
			<div className="points pb-12">
				<Container className="flex flex-col gap-3 px-4">
					<h2 className="text-app-text flex items-center gap-2 text-lg font-bold">
						<MapPinIcon weight="fill" className="text-gps" /> Punkty na trasie:
					</h2>
					<div className="relative mt-3 flex flex-col gap-3">
						<div className="absolute top-4 bottom-4 left-3.75 z-0 w-0.5 bg-neutral-800"></div>

						{waypoints.map(wpt => {
							const isActive = pitstops.active === wpt.name
							const isCompleted = pitstops.completed.includes(wpt.name)

							return (
								<div
									key={wpt.id}
									className={`relative z-10 flex items-center gap-4 rounded-xl border p-3 transition-all ${
										isActive
											? 'bg-pitstop/10 border-pitstop'
											: isCompleted
												? 'border-zinc-600 bg-zinc-800/50'
												: 'bg-app-surface border-zinc-700/50'
									}`}
								>
									<div
										className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
											isActive
												? 'border-pitstop bg-pitstop/20 animate-pulse'
												: isCompleted
													? 'border-zinc-500 bg-zinc-700'
													: 'bg-app-bg border-zinc-600'
										}`}
									>
										{isCompleted ? (
											<CheckCircleIcon weight="fill" className="text-zinc-400" />
										) : (
											<div className={`h-2 w-2 rounded-full ${isActive ? 'bg-pitstop' : 'bg-gps'}`}></div>
										)}
									</div>
									<div className="flex flex-col">
										<span
											className={`text-sm font-bold ${isActive ? 'text-pitstop' : isCompleted ? 'text-zinc-400 line-through' : 'text-app-text'}`}
										>
											{wpt.name}
										</span>
										<span className="text-app-muted font-mono text-xs">Punkt nawigacyjny</span>
									</div>
								</div>
							)
						})}
						{waypoints.length === 0 && <p className="text-app-muted text-sm">Brak oznaczonych punktów w pliku GPX.</p>}
					</div>
				</Container>
			</div>
		</div>
	)
}
