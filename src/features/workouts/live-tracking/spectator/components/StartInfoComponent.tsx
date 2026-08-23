// Zakładam, że Container masz zaimportowany z jakiejś swojej biblioteki UI

import Container from '@/components/ui/Container'
import { useCountdown } from '../hooks/useCountdown'

const DATA_START_TIME = new Date('2026-09-05T07:40:00')

export const StartInfoComponent = () => {
	// Gdzieś na górze komponentu wrzuć funkcję pomocniczą, jeśli nie zwracasz jej z hooka:
	const pad = (num: number) => num.toString().padStart(2, '0')

	// Wewnątrz Twojego komponentu:
	const { days, hours, minutes, seconds } = useCountdown(DATA_START_TIME)

	return (
		<div className="start-info pt-6">
			<Container className="flex flex-col gap-3 px-4">
				<div className="time bg-app-surface/80 flex flex-col items-center rounded-2xl border border-zinc-800 p-6 shadow-lg backdrop-blur-sm sm:items-start">
					<h3 className="mb-4 text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">Czas do startu</h3>

					<div className="flex items-end gap-4 sm:gap-6">
						{days > 0 && (
							<div className="flex flex-col items-center">
								<span className="bg-clip-text text-5xl font-black tracking-tighter text-indigo-500 tabular-nums drop-shadow-sm sm:text-6xl">
									{days}
								</span>
								<span className="mt-1 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Dni</span>
							</div>
						)}

						{days > 0 && <div className="mb-6 hidden h-10 w-px bg-zinc-700/50 sm:block"></div>}

						<div className="flex items-center gap-2 text-3xl font-bold tracking-wider text-zinc-100 tabular-nums sm:text-4xl">
							<div className="flex flex-col items-center">
								<span>{pad(hours)}</span>
								<span className="mt-1 text-[10px] font-bold tracking-widest text-zinc-600 uppercase">Godz</span>
							</div>

							<span className="mb-5 animate-pulse text-zinc-600">:</span>

							<div className="flex flex-col items-center">
								<span>{pad(minutes)}</span>
								<span className="mt-1 text-[10px] font-bold tracking-widest text-zinc-600 uppercase">Min</span>
							</div>

							<span className="mb-5 animate-pulse text-zinc-600">:</span>

							<div className="flex flex-col items-center">
								<span className="text-zinc-300">{pad(seconds)}</span>
								<span className="mt-1 text-[10px] font-bold tracking-widest text-zinc-600 uppercase">Sek</span>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</div>
	)
}
