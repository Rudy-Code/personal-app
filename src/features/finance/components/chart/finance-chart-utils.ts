import { eachMonthOfInterval, endOfMonth, format, startOfMonth, subMonths } from 'date-fns'
import { pl } from 'date-fns/locale'

import type { Transaction } from '../../types'

export interface DateRange {
	from: Date
	to: Date
}

export interface MonthlyBucket {
	key: string
	month: string
	monthShort: string
	income: number
	expenses: number
}

export type RangePreset = '3m' | '6m' | 'year' | 'custom'

export const MAX_RANGE_MONTHS = 24

function capitalize(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getPresetRange(preset: RangePreset, today: Date = new Date()): DateRange {
	switch (preset) {
		case '3m':
			return { from: startOfMonth(subMonths(today, 2)), to: endOfMonth(today) }
		case '6m':
			return { from: startOfMonth(subMonths(today, 5)), to: endOfMonth(today) }
		case 'year':
		default:
			return { from: new Date(today.getFullYear(), 0, 1), to: endOfMonth(today) }
	}
}

export function clampRangeToLimit(range: DateRange, maxMonths: number = MAX_RANGE_MONTHS): DateRange {
	const monthsApart =
		(range.to.getFullYear() - range.from.getFullYear()) * 12 + (range.to.getMonth() - range.from.getMonth()) + 1

	if (monthsApart <= maxMonths) return range

	const clampedFrom = new Date(range.to.getFullYear(), range.to.getMonth() - (maxMonths - 1), 1)
	return { from: clampedFrom, to: range.to }
}

export function aggregateTransactionsByMonth(transactions: Transaction[], range: DateRange): MonthlyBucket[] {
	const months = eachMonthOfInterval({
		start: startOfMonth(range.from),
		end: endOfMonth(range.to),
	})

	const buckets = new Map<string, { date: Date; income: number; expenses: number }>(
		months.map(date => [format(date, 'yyyy-MM'), { date, income: 0, expenses: 0 }])
	)

	for (const transaction of transactions) {
		const date = new Date(transaction.date)
		const key = format(date, 'yyyy-MM')
		const bucket = buckets.get(key)
		if (!bucket) continue

		if (transaction.type === 'income') {
			bucket.income += transaction.amount
		} else if (transaction.type === 'expense') {
			bucket.expenses += transaction.amount
		}
	}

	return Array.from(buckets.values()).map(bucket => ({
		key: format(bucket.date, 'yyyy-MM'),
		month: capitalize(format(bucket.date, 'LLLL', { locale: pl })),
		monthShort: capitalize(format(bucket.date, 'LLL', { locale: pl })),
		income: bucket.income,
		expenses: bucket.expenses,
	}))
}

export function summarizeTransactions(transactions: Transaction[], range: DateRange) {
	let totalIncome = 0
	let totalExpenses = 0

	const start = startOfMonth(range.from)
	const end = endOfMonth(range.to)

	for (const transaction of transactions) {
		const date = new Date(transaction.date)
		if (date < start || date > end) continue

		if (transaction.type === 'income') totalIncome += transaction.amount
		else if (transaction.type === 'expense') totalExpenses += transaction.amount
	}

	return {
		totalIncome,
		totalExpenses,
		balance: totalIncome - totalExpenses,
	}
}
