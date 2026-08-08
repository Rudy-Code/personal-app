interface PaceCardProps {
	currentPace: string
	avgPace: string
}

export function PaceCard({ currentPace, avgPace }: PaceCardProps) {
	return (
		<div className="tempo bg-app-surface flex flex-col gap-1 rounded-xl border border-zinc-700 px-4 py-4">
			<div className="flex flex-col gap-1 pb-2">
				<p className="text-app-muted text-xs uppercase">Tempo akt.</p>
				<div className="flex items-end gap-3">
					<span className="text-app-text data-nums text-2xl font-bold tracking-wide">{currentPace}</span>
					<span className="text-sm text-zinc-400">/km</span>
				</div>
			</div>
			<div className="flex flex-col gap-1 border-t border-zinc-700/50 pt-2">
				<p className="text-app-muted/90 text-xs uppercase">Średnie</p>
				<div className="flex items-end gap-3">
					<span className="text-app-text/80 data-nums text-lg font-bold tracking-wide">{avgPace}</span>
					<span className="text-sm text-zinc-400">/km</span>
				</div>
			</div>
		</div>
	)
}
