import { useState, useEffect } from 'react'

import { gpx } from '@tmcw/togeojson'
import { MapRenderer } from './MapRenderer'
import Container from '@components/ui/Container'
import { PaceCard } from './PaceCard'
import { DistanceCard } from './DistanceCard'
import { TimeStatsCard } from './TimeStatsCard'
import { HeartRateCard } from './HeartRateCard'
import { MoodInfo } from './MoodInfo'

export function SpectatorDashboard() {
	const [currentPosition] = useState<[number, number]>([49.968, 20.43])
	const [routeGeoJson, setRouteGeoJson] = useState<any | null>(null)

	const EVENT_NAME = 'Ultra 48km'
	const status = 'LIVE'

	const mockData = {
		time: { net: '04:12:30', gross: '04:45:15' },
		hr: { current: 144, average: 138 },
		pace: { current: '5:45', average: '8:20' },
		distance: { covered: 32.5, remaining: 15.5 },
	}

	useEffect(() => {
		fetch('/Ultra-1.gpx')
			.then(response => {
				if (!response.ok) throw new Error('Nie znaleziono pliku Ultra-1.gpx w folderze public!')
				return response.text()
			})
			.then(gpxText => {
				// gpxText to xml to json
				const parser = new DOMParser()
				const xml = parser.parseFromString(gpxText, 'text/xml')

				const geoJsonData = gpx(xml)
				setRouteGeoJson(geoJsonData)
			})
			.catch(error => {
				console.error('Błąd ładowania GPX:', error)
			})
	}, [])

	return (
		<div className="flex h-full w-full flex-col overflow-hidden font-sans">
			<div className="relative z-0 h-100 w-full overflow-hidden md:h-240 md:rounded-xl">
				<MapRenderer currentPosition={currentPosition} routeGeoJson={routeGeoJson} />

				<div className="pointer-events-none absolute top-0 right-0 left-0 z-400 flex justify-between bg-linear-to-b from-black/80 to-transparent p-4">
					<span className="text-sm font-black tracking-widest text-white uppercase">{EVENT_NAME}</span>
					<div className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-black/60 px-2.5 py-1 backdrop-blur-md">
						<div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></div>
						<span className="text-[9px] font-black tracking-widest text-green-500">{status}</span>
					</div>
				</div>
			</div>

			<div className="stats py-6">
				<Container className="flex flex-col gap-3 px-4">
					<TimeStatsCard netTime={mockData.time.net} grossTime={mockData.time.gross} />
					<HeartRateCard currentHr={mockData.hr.current} avgHr={mockData.hr.average} />
					<div className="grid grid-cols-2 gap-2">
						<PaceCard currentPace={mockData.pace.current} avgPace={mockData.pace.average} />
						<DistanceCard covered={mockData.distance.covered} remaining={mockData.distance.remaining} />
					</div>
					<MoodInfo mood="Odcięło mi prąd. Umieram." />
				</Container>
			</div>

			<div className="points">
				<Container className="flex flex-col gap-3 px-4">
					<h2 className="text-app-text text-lg font-bold">Punkty na trasie:</h2>

					<div className="mt-3"></div>
				</Container>
			</div>
		</div>
	)
}
