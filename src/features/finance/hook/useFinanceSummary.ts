import { useMemo } from 'react'
import { useFinanceStore } from '../stores/useFinanceStore'

export const useFinanceSummary = (targetMonth?: number, targetYear?: number) => {
	const transactions = useFinanceStore(state => state.transactions)
	const accounts = useFinanceStore(state => state.accounts)
	const settings = useFinanceStore(state => state.settings)

	const currentDate = new Date()
	const month = targetMonth ?? currentDate.getMonth() + 1
	const year = targetYear ?? currentDate.getFullYear()

	return useMemo(() => {
		const prevMonth = month === 1 ? 12 : month - 1
		const prevYear = month === 1 ? year - 1 : year

		const initialTotal = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)

		const upToTargetMonthTransactions = transactions.filter(t => {
			const date = new Date(t.date)
			return date.getFullYear() < year || (date.getFullYear() === year && date.getMonth() + 1 <= month)
		})

		const targetHistoricalIncome = upToTargetMonthTransactions
			.filter(t => t.type === 'income')
			.reduce((sum, t) => sum + t.amount, 0)

		const targetHistoricalExpense = upToTargetMonthTransactions
			.filter(t => t.type === 'expense')
			.reduce((sum, t) => sum + t.amount, 0)

		const totalBalance = initialTotal + targetHistoricalIncome - targetHistoricalExpense

		// --- CAŁKOWITE SALDO W POPRZEDNIM MIESIĄCU ---
		const upToPrevMonthTransactions = transactions.filter(t => {
			const date = new Date(t.date)
			return date.getFullYear() < prevYear || (date.getFullYear() === prevYear && date.getMonth() + 1 <= prevMonth)
		})

		const prevHistoricalIncome = upToPrevMonthTransactions
			.filter(t => t.type === 'income')
			.reduce((sum, t) => sum + t.amount, 0)

		const prevHistoricalExpense = upToPrevMonthTransactions
			.filter(t => t.type === 'expense')
			.reduce((sum, t) => sum + t.amount, 0)

		const prevTotalBalance = initialTotal + prevHistoricalIncome - prevHistoricalExpense

		const balanceGrowthPercent = prevTotalBalance > 0 ? ((totalBalance - prevTotalBalance) / prevTotalBalance) * 100 : 0

		const currentMonthTransactions = transactions.filter(t => {
			const date = new Date(t.date)
			return date.getMonth() + 1 === month && date.getFullYear() === year
		})

		const monthlyIncome = currentMonthTransactions
			.filter(t => t.type === 'income')
			.reduce((sum, t) => sum + t.amount, 0)

		const monthlyExpense = currentMonthTransactions
			.filter(t => t.type === 'expense')
			.reduce((sum, t) => sum + t.amount, 0)

		// ---  WSKAŹNIKI Z DESIGNU ---
		const expenseLimitPercent =
			settings.monthlyExpenseLimit > 0 ? (monthlyExpense / settings.monthlyExpenseLimit) * 100 : 0

		const isIncomeOnTrack = monthlyIncome >= settings.monthlyIncomeGoal

		return {
			totalBalance,
			balanceGrowthPercent,
			monthlyIncome,
			monthlyExpense,
			monthlyBalance: monthlyIncome - monthlyExpense,
			expenseLimitPercent,
			isIncomeOnTrack,
			settings,
		}
	}, [transactions, accounts, settings, month, year])
}
