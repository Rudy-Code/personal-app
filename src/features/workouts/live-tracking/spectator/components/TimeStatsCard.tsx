import { useState, useEffect } from 'react'
import { PersonSimpleRunIcon, TimerIcon } from '@phosphor-icons/react'

export function TimeStatsCard({ timeData }: { timeData: any }) {
	const [netStr, setNetStr] = useState('--:--:--')
	const [grossStr, setGrossStr] = useState('--:--:--')

	useEffect(() => {
		if (!timeData || !timeData.startTime) return

		const interval = setInterval(() => {
			const now = timeData.endTime || Date.now()
			const grossMs = now - timeData.startTime

			let currentPitstopTime = 0
			if (timeData.pitstopStartTime && !timeData.endTime) {
				currentPitstopTime = now - timeData.pitstopStartTime
			}
			const netMs = Math.max(0, grossMs - timeData.totalPitstopTime - currentPitstopTime)

			const formatTime = (ms: number) => {
				const h = Math.floor(ms / 3600000)
					.toString()
					.padStart(2, '0')
				const m = Math.floor((ms % 3600000) / 60000)
					.toString()
					.padStart(2, '0')
				const s = Math.floor((ms % 60000) / 1000)
					.toString()
					.padStart(2, '0')
				return `${h}:${m}:${s}`
			}

			setGrossStr(formatTime(grossMs))
			setNetStr(formatTime(netMs))
		}, 1000)

		return () => clearInterval(interval)
	}, [timeData])

	return (
		<div className="time bg-app-surface flex flex-col rounded-xl border border-zinc-700 px-4 py-4">
			<h3 className="text-app-text text-lg font-semibold">Czas:</h3>
			<div className="mt-4 grid grid-cols-2 gap-4">
				<div className="netto-time flex flex-col justify-center gap-1.5">
					<div className="text-app-muted flex items-center gap-1">
						<PersonSimpleRunIcon size={12} />
						<p className="text-xs font-light text-zinc-400 uppercase">W ruchu</p>
					</div>
					<span className="text-app-text data-nums text-2xl font-bold tracking-wide">{netStr}</span>
				</div>
				<div className="brutto-time flex flex-col gap-1.5">
					<div className="text-app-muted flex items-center gap-1 self-end">
						<TimerIcon size={12} />
						<p className="text-xs font-light text-zinc-400 uppercase">Całkowity</p>
					</div>
					<span className="text-app-muted/80 data-nums self-end text-2xl font-bold tracking-wide">{grossStr}</span>
				</div>
			</div>
		</div>
	)
}
