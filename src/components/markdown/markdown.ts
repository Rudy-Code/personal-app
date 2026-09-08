import { defaultUrlTransform } from 'react-markdown'

export const TEXT_COLORS = {
	red: { label: 'Czerwony', className: 'text-red-600 dark:text-red-400', hex: '#dc2626' },
	orange: { label: 'Pomarańczowy', className: 'text-orange-700 dark:text-orange-400', hex: '#c2410c' },
	green: { label: 'Zielony', className: 'text-emerald-700 dark:text-emerald-400', hex: '#047857' },
	blue: { label: 'Niebieski', className: 'text-blue-700 dark:text-blue-400', hex: '#1d4ed8' },
	purple: { label: 'Fioletowy', className: 'text-violet-700 dark:text-violet-400', hex: '#6d28d9' },
}
export function colorClass(url: string) {
	const key = url.slice(6)
	return url.startsWith('color:') && Object.hasOwn(TEXT_COLORS, key)
		? TEXT_COLORS[key as keyof typeof TEXT_COLORS].className
		: undefined
}
export function markdownUrl(url: string, key: string) {
	if (key === 'src') return /^local-image:[\w-]+$/.test(url) ? url : ''
	if (colorClass(url)) return url
	return defaultUrlTransform(url)
}
