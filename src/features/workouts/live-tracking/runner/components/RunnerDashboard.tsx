import { useState, useEffect, useMemo } from 'react'
import { gpx } from '@tmcw/togeojson'
import { useRunnerStore } from '../stores/useRunnerStore'
import { usePolarH10 } from '../hooks/usePolarH10'
import { useRunEngine } from '../hooks/useRunEngine'
import { useRunnerSocket } from '../hooks/useRunnerSocket'
import {
	PlayCircleIcon,
	StopCircleIcon,
	HeartIcon,
	CrosshairIcon,
	SkullIcon,
	DropIcon,
	FireIcon,
	ToiletIcon,
	MapPinIcon,
	CheckCircleIcon,
} from '@phosphor-icons/react'

export function RunnerDashboard() {
	// Prawidłowe wyciągnięcie zmiennych ze Store'a, żeby React wiedział kiedy odświeżyć UI
	const { isTracking, hr, coordinates, activePitstop, completedPitstops, setMood, togglePitstop } = useRunnerStore()

	const { isConnected, connectPolar, error } = usePolarH10()
	const { startTracking, stopTracking } = useRunEngine()
	const { forceSync } = useRunnerSocket()

	const [routeGeoJson, setRouteGeoJson] = useState<any | null>(null)

	// Stany do zabezpieczenia przycisku STOP
	const [isConfirmingStop, setIsConfirmingStop] = useState(false)
	const [stopInput, setStopInput] = useState('')

	useEffect(() => {
		fetch('/Ultra-1.gpx')
			.then(res => res.text())
			.then(gpxText => {
				const parser = new DOMParser()
				setRouteGeoJson(gpx(parser.parseFromString(gpxText, 'text/xml')))
			})
	}, [])

	const waypoints = useMemo(() => {
		if (!routeGeoJson) return []
		return routeGeoJson.features
			.filter((feature: any) => feature.geometry.type === 'Point')
			.map((feature: any) => feature.properties.name || 'Punkt kontrolny')
	}, [routeGeoJson])

	const handlePitstop = (pitstopName: string) => {
		togglePitstop(pitstopName)
		forceSync() // Od razu wypychamy nowy stan netto/brutto do serwera
		if (navigator.vibrate) navigator.vibrate([100, 50, 100])
	}

	const handleStopRun = () => {
		stopTracking()
		setTimeout(() => forceSync(), 100)
		setIsConfirmingStop(false)
		setStopInput('')
	}

	return (
		<div className="bg-app-bg text-app-text flex h-[100dvh] flex-col overflow-y-auto p-6 font-sans">
			{/* HEADER */}
			<div className="mb-8 flex shrink-0 items-center justify-between">
				<button
					onClick={connectPolar}
					className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all ${isConnected ? 'border-hr text-hr' : 'border-zinc-700 text-zinc-400'}`}
				>
					<HeartIcon weight="fill" className={isConnected ? 'animate-pulse' : ''} />
					{isConnected ? `${hr} BPM` : 'Połącz H10'}
				</button>
				<span className="flex items-center gap-1 font-mono text-xs font-bold text-zinc-500">
					<CrosshairIcon className={coordinates ? 'text-gps' : ''} /> {coordinates ? 'GPS OK' : 'Brak GPS'}
				</span>
			</div>

			{error && <p className="text-hr mb-4 text-xs">{error}</p>}

			{/* GŁÓWNA SEKCJA START / STOP Z ZABEZPIECZENIEM */}
			<div className="flex min-h-[280px] shrink-0 flex-col items-center justify-center py-6">
				{!isTracking ? (
					<button
						onClick={startTracking}
						className="border-live bg-live/10 text-live active:bg-live/30 flex aspect-square w-full max-w-[240px] flex-col items-center justify-center gap-4 rounded-full border-4 shadow-[0_0_50px_rgba(0,230,118,0.2)] transition-all active:scale-95"
					>
						<PlayCircleIcon size={64} weight="fill" />
						<span className="text-3xl font-black tracking-widest uppercase">Start</span>
					</button>
				) : isConfirmingStop ? (
					<div className="animate-in zoom-in-95 flex w-full max-w-[240px] flex-col items-center gap-4">
						<span className="text-hr text-center text-sm font-black tracking-widest uppercase">
							Wpisz "STOP" aby zakończyć
						</span>
						<input
							type="text"
							value={stopInput}
							onChange={e => setStopInput(e.target.value.toUpperCase())}
							placeholder="STOP"
							className="bg-app-surface border-hr w-full rounded-xl border-2 p-4 text-center text-2xl font-black text-white focus:outline-none"
						/>
						<div className="mt-2 flex w-full gap-2">
							<button
								onClick={() => {
									setIsConfirmingStop(false)
									setStopInput('')
								}}
								className="flex-1 rounded-xl bg-zinc-800 p-3 font-bold text-zinc-300 transition-all active:scale-95"
							>
								Anuluj
							</button>
							<button
								disabled={stopInput !== 'STOP'}
								onClick={handleStopRun}
								className="bg-hr flex-1 rounded-xl p-3 font-bold text-white transition-all active:scale-95 disabled:opacity-20"
							>
								Potwierdź
							</button>
						</div>
					</div>
				) : (
					<button
						onClick={() => setIsConfirmingStop(true)}
						className="border-hr/80 bg-hr/10 text-hr active:bg-hr/30 flex aspect-square w-full max-w-[240px] flex-col items-center justify-center gap-4 rounded-full border-4 transition-all active:scale-95"
					>
						<StopCircleIcon size={64} weight="fill" />
						<span className="text-2xl font-black tracking-widest uppercase">Zakończ</span>
					</button>
				)}
			</div>

			{isTracking && (
				<div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-8 pb-12">
					{/* SZYBKIE STATUSY */}
					<div className="flex flex-col gap-3">
						<p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Szybki Status</p>
						<div className="grid grid-cols-2 gap-3">
							<button
								onClick={() => handleQuickMood('Ogień, lecę dobrze!')}
								className="text-app-text flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 p-3 transition-all active:scale-95 active:bg-zinc-700"
							>
								<FireIcon className="text-pitstop" size={20} weight="fill" />
								<span className="text-[10px] font-bold tracking-wider uppercase">Lecę Dobrze</span>
							</button>
							<button
								onClick={() => handleQuickMood('Potrzebuję pić!')}
								className="text-app-text flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 p-3 transition-all active:scale-95 active:bg-zinc-700"
							>
								<DropIcon className="text-blue-400" size={20} weight="fill" />
								<span className="text-[10px] font-bold tracking-wider uppercase">Brak wody</span>
							</button>
							<button
								onClick={() => handleQuickMood('Toaleta / Zatrzymanie')}
								className="text-app-text flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 p-3 transition-all active:scale-95 active:bg-zinc-700"
							>
								<ToiletIcon className="text-zinc-400" size={20} weight="fill" />
								<span className="text-[10px] font-bold tracking-wider uppercase">Krzaki</span>
							</button>
							<button
								onClick={() => handleQuickMood('Odcięło Prąd')}
								className="border-hr/50 bg-hr/20 text-hr active:bg-hr/30 flex items-center gap-2 rounded-xl border p-3 transition-all active:scale-95"
							>
								<SkullIcon size={20} weight="fill" />
								<span className="text-[10px] font-bold tracking-wider uppercase">Kryzys</span>
							</button>
						</div>
					</div>

					{/* CHECKPOINTY (PRZEPAKI) - Z WYRAŹNYM STYLEM */}
					<div className="flex flex-col gap-3">
						<p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Zamelduj Pitstop</p>
						<div className="flex flex-col gap-2">
							{waypoints.map((wptName, idx) => {
								const isActive = activePitstop === wptName
								const isCompleted = completedPitstops.includes(wptName)

								return (
									<button
										key={idx}
										onClick={() => handlePitstop(wptName)}
										disabled={isCompleted}
										className={`flex items-center justify-between gap-3 rounded-xl border p-4 transition-all ${
											isActive
												? 'bg-pitstop border-pitstop text-black shadow-[0_0_20px_rgba(255,165,2,0.4)]'
												: isCompleted
													? 'border-zinc-700 bg-zinc-800/20 opacity-40'
													: 'border-zinc-700 bg-zinc-800/30 active:scale-95'
										}`}
									>
										<div className="flex flex-col items-start gap-1">
											<div className="flex items-center gap-3">
												<MapPinIcon
													className={isActive ? 'text-black' : isCompleted ? 'text-live' : 'text-gps'}
													size={24}
													weight={isActive ? 'fill' : 'regular'}
												/>
												<span
													className={`text-sm font-black tracking-widest uppercase ${isActive ? 'text-black' : isCompleted ? 'text-live' : 'text-app-text'}`}
												>
													{wptName}
												</span>
											</div>
											{isActive && (
												<span className="ml-9 animate-pulse text-[10px] font-black tracking-widest uppercase opacity-80">
													Jesteś na miejscu - Kliknij by wyjść
												</span>
											)}
										</div>
										{isCompleted && <CheckCircleIcon size={24} weight="fill" className="text-live" />}
									</button>
								)
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
