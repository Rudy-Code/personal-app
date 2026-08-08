import { HeartIcon } from '@phosphor-icons/react'

interface HeartRateCardProps {
	currentHr: number | string
	avgHr: number | string
}

export function HeartRateCard({ currentHr, avgHr }: HeartRateCardProps) {
	return (
		<div className="pulse flex flex-col gap-2 rounded-xl border border-red-400/20 bg-red-600/10 px-4 py-4">
			<div className="flex items-center gap-1 text-red-500/80">
				<HeartIcon size={12} weight="fill" className="animate-pulse" />
				<p className="text-xs font-medium uppercase">Aktualne tętno</p>
			</div>
			<div className="flex items-center justify-between">
				<span className="text-app-text data-nums text-4xl font-bold tracking-wide">{currentHr}</span>
				<div className="flex flex-col gap-0.5 text-right">
					<span className="text-xs text-red-500/60 uppercase">Średnie hr</span>
					<span className="data-nums self-end text-xl font-bold tracking-wide text-red-300/60">{avgHr}</span>
				</div>
			</div>
		</div>
	)
}
