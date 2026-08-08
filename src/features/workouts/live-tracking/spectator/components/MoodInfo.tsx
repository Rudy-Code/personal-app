import { useState, useEffect } from 'react'
import { SkullIcon, FireIcon, DropIcon, ToiletIcon } from '@phosphor-icons/react'

export function MoodInfo({ moodData }: { moodData: { text: string; timestamp: number } }) {
	const [mins, setMins] = useState(0)

	useEffect(() => {
		const updateMins = () => setMins(Math.floor((Date.now() - moodData.timestamp) / 60000))
		updateMins()
		const interval = setInterval(updateMins, 60000)
		return () => clearInterval(interval)
	}, [moodData])

	// Wybieramy ikonę na podstawie tekstu
	let Icon = SkullIcon
	let color = 'text-hr'
	if (moodData.text.includes('dobrze')) {
		Icon = FireIcon
		color = 'text-pitstop'
	}
	if (moodData.text.includes('pić')) {
		Icon = DropIcon
		color = 'text-blue-400'
	}
	if (moodData.text.includes('Toaleta')) {
		Icon = ToiletIcon
		color = 'text-zinc-400'
	}

	return (
		<div className="mood-info animate-in fade-in flex items-center justify-center gap-4 rounded-xl border border-zinc-700/20 bg-zinc-800/10 py-3">
			<Icon size={32} weight="fill" className={color} />
			<div className="flex flex-col">
				<p className="text-app-muted text-sm font-medium uppercase">Status ({mins}m temu)</p>
				<p className="text-app-text mt-1 text-sm font-bold">{moodData.text}</p>
			</div>
		</div>
	)
}
