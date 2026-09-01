export type colorType =
	| 'bg-emerald-600'
	| 'bg-blue-600'
	| 'bg-amber-600'
	| 'bg-rose-600'
	| 'bg-violet-600'
	| 'bg-cyan-600'
	| 'bg-orange-600'
	| 'bg-pink-600'
	| 'bg-lime-600'
	| 'bg-indigo-600'
	| 'bg-red-600'
	| 'bg-teal-600'
	| 'bg-fuchsia-600'
	| 'bg-yellow-600'
	| 'bg-slate-600'
	| 'bg-red-700'
	| 'bg-blue-700'
	| 'bg-emerald-700'
	| 'bg-indigo-700'
	| 'bg-amber-700'

export interface Color {
	name: string
	bg: colorType
	text: string
}
