import { SkullIcon } from '@phosphor-icons/react'

export function MoodInfo({ mood }: { mood: string }) {
	return (
		<div className="mood-info flex items-center justify-center gap-4 rounded-xl border border-zinc-700/20 bg-zinc-800/10 py-3">
			<SkullIcon size={32} weight="fill" className="text-zinc-400" />
			<div className="flex flex-col">
				<p className="text-app-muted text-sm font-medium uppercase">Samopoczucie (1m temu)</p>
				<p className="text-app-text mt-1 text-sm font-bold">{mood}</p>
			</div>
		</div>
	)
}
