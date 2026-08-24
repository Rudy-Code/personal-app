'use client'

import { useMemo } from 'react'

// TODO: Docelowo te dane wpadną z Twojego store'a
const rawExpensesData = [
	{ category: 'Mieszkanie', amount: 2100, color: 'bg-rose-500' },
	{ category: 'Jedzenie', amount: 1250, color: 'bg-amber-400' },
	{ category: 'Transport', amount: 450, color: 'bg-blue-500' },
	{ category: 'Inne', amount: 150, color: 'bg-slate-300' },
]

export function FinanceExpensesChart() {
	const dataWithPercentages = useMemo(() => {
		const total = rawExpensesData.reduce((acc, curr) => acc + curr.amount, 0)

		return rawExpensesData.map(item => ({
			...item,
			percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0,
		}))
	}, [])

	return (
		<div className="flex w-full flex-col p-1">
			<h2 className="text-secondary font-semibold tracking-wide">Struktura wydatków</h2>

			<div className="mt-5 mb-6 flex h-4 w-full overflow-hidden rounded-full">
				{dataWithPercentages.map(item => (
					<div
						key={item.category}
						className={`h-full ${item.color} transition-all duration-500`}
						style={{ width: `${item.percentage}%` }}
						title={`${item.category}: ${item.amount} zł`}
					/>
				))}
			</div>

			{/* LEGENDA */}
			<div className="flex flex-col gap-3">
				{dataWithPercentages.map(item => (
					<div key={item.category} className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className={`size-3 rounded-full ${item.color}`} />
							<span className="text-muted-foreground text-sm font-medium">{item.category}</span>
						</div>
						<span className="text-secondary font-mono text-sm font-bold tabular-nums">{item.percentage}%</span>
					</div>
				))}
			</div>
		</div>
	)
}
