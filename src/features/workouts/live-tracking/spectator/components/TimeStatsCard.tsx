import { PersonSimpleRunIcon, TimerIcon } from '@phosphor-icons/react'

interface TimeStatsCardProps {
	netTime: string
	grossTime: string
}

export function TimeStatsCard({ netTime, grossTime }: TimeStatsCardProps) {
	return (
		<div className="time bg-app-surface flex flex-col rounded-xl border border-zinc-700 px-4 py-4">
			<h3 className="text-app-text text-lg font-semibold">Czas:</h3>
			<div className="mt-4 grid grid-cols-2 gap-4">
				<div className="netto-time flex flex-col justify-center gap-1.5">
					<div className="text-app-muted flex items-center gap-1">
						<PersonSimpleRunIcon size={12} />
						<p className="text-xs font-light text-zinc-400 uppercase">W ruchu</p>
					</div>
					<span className="text-app-text data-nums text-2xl font-bold tracking-wide">{netTime}</span>
				</div>
				<div className="brutto-time flex flex-col gap-1.5">
					<div className="text-app-muted flex items-center gap-1 self-end">
						<TimerIcon size={12} />
						<p className="text-xs font-light text-zinc-400 uppercase">Całkowity</p>
					</div>
					<span className="text-app-muted/80 data-nums self-end text-2xl font-bold tracking-wide">{grossTime}</span>
				</div>
			</div>
		</div>
	)
}
