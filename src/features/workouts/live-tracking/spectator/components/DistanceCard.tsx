interface DistanceCardProps {
	covered: number | string
	remaining: number | string
}

export function DistanceCard({ covered, remaining }: DistanceCardProps) {
	return (
		<div className="distance bg-app-surface flex flex-col gap-1 rounded-xl border border-zinc-700 px-4 py-4">
			<div className="flex flex-col items-end gap-1 pb-2">
				<p className="text-app-muted text-xs uppercase">Dystans</p>
				<div className="flex items-end gap-2">
					<span className="text-gps/90 data-nums text-2xl font-bold tracking-wide">{covered}</span>
					<span className="text-sm text-zinc-400">km</span>
				</div>
			</div>
			<div className="flex flex-col items-end gap-1 border-t border-zinc-700/50 pt-2">
				<p className="text-app-muted/90 text-xs uppercase">Pozostało</p>
				<div className="flex items-end gap-2">
					<span className="text-app-text/80 data-nums text-lg font-bold tracking-wide">{remaining}</span>
					<span className="text-sm text-zinc-400">km</span>
				</div>
			</div>
		</div>
	)
}
