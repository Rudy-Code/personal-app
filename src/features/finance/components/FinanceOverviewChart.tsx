'use client'

import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { TrendingUp, TrendingDown, Filter } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart'

const chartData = [
	{ month: 'Styczeń', income: 1860, expenses: 800 },
	{ month: 'Luty', income: 3050, expenses: 2000 },
	{ month: 'Marzec', income: 2370, expenses: 1200 },
	{ month: 'Kwiecień', income: 730, expenses: 1900 },
	{ month: 'Maj', income: 2090, expenses: 1300 },
	{ month: 'Czerwiec', income: 3100, expenses: 1100 },
	{ month: 'Lipiec', income: 2140, expenses: 1400 },
	{ month: 'Sierpień', income: 3500, expenses: 720 },
	{ month: 'Wrzesień', income: 0, expenses: 0 },
	{ month: 'Październik', income: 0, expenses: 0 },
	{ month: 'Listopad', income: 0, expenses: 0 },
	{ month: 'Grudzień', income: 0, expenses: 0 },
]

const chartConfig = {
	income: {
		label: 'Przychody',
		color: 'var(--color-emerald-500, #10b981)',
	},
	expenses: {
		label: 'Wydatki',
		color: 'var(--color-amber-500, #f59e0b)',
	},
} satisfies ChartConfig

export function FinanceOverviewChart() {
	const [year, setYear] = useState('2026')

	// TODO: sortowanie po dacie np. 3 miesiace itd

	const summary = useMemo(() => {
		const totalIncome = chartData.reduce((acc, curr) => acc + curr.income, 0)
		const totalExpenses = chartData.reduce((acc, curr) => acc + curr.expenses, 0)
		const balance = totalIncome - totalExpenses
		return { totalIncome, totalExpenses, balance }
	}, [])

	return (
		// overflow-hidden na mobile chroni przed wylewaniem się SVG
		<Card className="flex w-full flex-col overflow-hidden p-4 sm:p-6">
			<div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h2 className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
						Bilans Roczny ({year})
					</h2>
					<div className="flex items-baseline gap-3">
						<span className="text-foreground font-mono text-3xl font-bold tabular-nums sm:text-4xl">
							{summary.balance.toLocaleString('pl-PL')} zł
						</span>
						<span
							className={`flex items-center gap-1 text-sm font-medium ${summary.balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
						>
							{summary.balance >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
						</span>
					</div>
				</div>

				<Button variant="outline" size="sm" className="w-full gap-2 sm:w-auto">
					<Filter size={14} />
					Rok: {year}
				</Button>
			</div>

			<div className="min-w-0 flex-1">
				<ChartContainer config={chartConfig} className="max-h-92 w-full">
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={value => value.slice(0, 3)}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Bar dataKey="income" fill="var(--color-income)" radius={4} />
						<Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
					</BarChart>
				</ChartContainer>
			</div>
		</Card>
	)
}
