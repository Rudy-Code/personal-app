'use client'

import { useMemo } from 'react'
import { useFinanceStore } from '../stores/useFinanceStore'

export function FinanceExpensesChart() {
	const { categories, transactions } = useFinanceStore.getState()
	const expensesData = transactions.filter(t => t.type === 'expense')

	const expensesByCategory = categories
		.filter(category => category.type === 'expense')
		.map(category => {
			const categoryExpenses = expensesData.filter(t => t.categoryId === category.id)

			const totalAmount = categoryExpenses.reduce((sum, t) => sum + t.amount, 0)

			return {
				id: category.id,
				name: category.name,
				color: category.color,
				totalAmount,
			}
		})
		.filter(item => item.totalAmount > 0)
		.sort((a, b) => b.totalAmount - a.totalAmount)

	const dataWithPercentages = useMemo(() => {
		const total = expensesByCategory.reduce((acc, curr) => acc + curr.totalAmount, 0)

		return expensesByCategory.map(item => ({
			...item,
			percentage: total > 0 ? Math.round((item.totalAmount / total) * 100) : 0,
		}))
	}, [expensesByCategory])

	return (
		<div className="flex w-full flex-col p-1">
			<h2 className="text-secondary font-semibold tracking-wide">Struktura wydatków</h2>

			{expensesByCategory.length === 0 ? (
				<div className="mt-4">
					<span className="text-muted-foreground">Brak wydatków w tym miesiącu</span>
				</div>
			) : (
				<>
					<div className="mt-5 mb-6 flex h-4 w-full overflow-hidden rounded-full">
						{dataWithPercentages.map(item => (
							<div
								key={item.name}
								className={`h-full ${item.color} transition-all duration-500`}
								style={{ width: `${item.percentage}%` }}
								title={`${item.name}: ${item.totalAmount} zł`}
							/>
						))}
					</div>

					<div className="flex flex-col gap-3">
						{dataWithPercentages.map(item => (
							<div key={item.name} className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className={`size-3 rounded-full ${item.color}`} />
									<span className="text-muted-foreground text-sm font-medium">{item.name}</span>
								</div>
								<span className="text-secondary font-mono text-sm font-bold tabular-nums">{item.percentage}%</span>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
}
