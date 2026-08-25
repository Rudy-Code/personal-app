export const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: 'PLN',
		minimumFractionDigits: 2,
	}).format(value)
}

export const formatDate = (date: Date): string => {
	return new Intl.DateTimeFormat('pl-PL', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(date)
}

export const formatDateMonth = (month: number): string => {
	const date = new Date(2000, month - 1, 1)
	const monthName = new Intl.DateTimeFormat('pl-PL', { month: 'long' }).format(date)
	return monthName.charAt(0).toUpperCase() + monthName.slice(1)
}
