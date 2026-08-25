'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { CalendarRange, TrendingDown, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart'
import { toast } from '@/components/ui/toast'
import { useIsMobile } from '@/hooks/use-mobile'

import { useFinanceStore } from '../../stores/useFinanceStore'

import {
	aggregateTransactionsByMonth,
	clampRangeToLimit,
	getPresetRange,
	MAX_RANGE_MONTHS,
	summarizeTransactions,
	type DateRange,
	type RangePreset,
} from './finance-chart-utils'

const chartConfig = {
	income: {
		label: 'Przychody',
		color: 'var(--chart-income)',
	},
	expenses: {
		label: 'Wydatki',
		color: 'var(--chart-expense)',
	},
} satisfies ChartConfig

const presetOptions: { value: RangePreset; label: string }[] = [
	{ value: '3m', label: 'Ostatnie 3 miesiące' },
	{ value: '6m', label: 'Ostatnie 6 miesięcy' },
	{ value: 'year', label: 'Ten rok' },
	{ value: 'custom', label: 'Własny zakres' },
]

const compactNumber = new Intl.NumberFormat('pl-PL', {
	notation: 'compact',
	maximumFractionDigits: 1,
})

const currency = new Intl.NumberFormat('pl-PL', {
	style: 'currency',
	currency: 'PLN',
})

export function FinanceOverviewChart() {
	const transactions = useFinanceStore(state => state.transactions)
	const isMobile = useIsMobile()

	const [preset, setPreset] = useState<RangePreset>('year')
	const [range, setRange] = useState<DateRange>(() => getPresetRange('year'))
	const [customDraft, setCustomDraft] = useState<{ from?: Date; to?: Date }>({})

	useEffect(() => {
		if (isMobile && preset === 'year') {
			setPreset('3m')
			setRange(getPresetRange('3m'))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMobile])

	function handlePresetChange(value: RangePreset) {
		setPreset(value)
		if (value === 'custom') {
			setCustomDraft({})
			return
		}
		setRange(getPresetRange(value))
	}

	function handleCustomRangeSelect(selected: { from?: Date; to?: Date } | undefined) {
		setCustomDraft(selected ?? {})
		if (!selected?.from || !selected?.to) return

		const requested = { from: selected.from, to: selected.to }
		const monthsApart =
			(requested.to.getFullYear() - requested.from.getFullYear()) * 12 +
			(requested.to.getMonth() - requested.from.getMonth()) +
			1

		if (monthsApart > MAX_RANGE_MONTHS) {
			toast.add({
				type: 'warning',
				title: 'Zbyt szeroki zakres',
				description: `Maksymalnie ${MAX_RANGE_MONTHS} miesięcy naraz - dłuższy zakres robi z wykresu nieczytelną kaszę.`,
			})
			setRange(clampRangeToLimit(requested))
			return
		}

		setRange(requested)
	}

	const chartData = useMemo(() => aggregateTransactionsByMonth(transactions, range), [transactions, range])
	const summary = useMemo(() => summarizeTransactions(transactions, range), [transactions, range])

	const rangeLabel = useMemo(() => {
		if (preset === 'year') return format(range.to, 'yyyy')
		return `${format(range.from, 'LLL yyyy', { locale: pl })} - ${format(range.to, 'LLL yyyy', { locale: pl })}`
	}, [preset, range])

	const hasAnyTransactions = transactions.length > 0
	const hasDataInRange = chartData.some(bucket => bucket.income > 0 || bucket.expenses > 0)

	return (
		<Card className="flex w-full flex-col overflow-hidden p-4 sm:p-6">
			<div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h2 className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
						Bilans ({rangeLabel})
					</h2>
					<div className="flex items-baseline gap-3">
						<span className="text-foreground font-mono text-3xl font-bold tabular-nums sm:text-4xl">
							{currency.format(summary.balance)}
						</span>
						<span
							className={`flex items-center gap-1 text-sm font-medium ${
								summary.balance >= 0 ? 'text-emerald-500' : 'text-red-500'
							}`}
						>
							{summary.balance >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
						</span>
					</div>
				</div>

				<div className="flex w-full items-center gap-2 sm:w-auto">
					<Select
						items={presetOptions}
						value={preset}
						onValueChange={value => handlePresetChange(value as RangePreset)}
					>
						<SelectTrigger className="w-full sm:w-50">
							<SelectValue placeholder="Zakres" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{presetOptions.map(option => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>

					{preset === 'custom' && (
						<Popover>
							<PopoverTrigger render={<Button variant="outline" size="icon" aria-label="Wybierz zakres dat" />}>
								<CalendarRange size={16} />
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="end">
								<Calendar
									mode="range"
									selected={customDraft}
									onSelect={handleCustomRangeSelect}
									numberOfMonths={isMobile ? 1 : 2}
									disabled={{ after: new Date() }}
								/>
							</PopoverContent>
						</Popover>
					)}
				</div>
			</div>

			<div className="min-w-0 flex-1">
				{!hasAnyTransactions ? (
					<EmptyState message="Brak transakcji. Dodaj pierwszą, żeby zobaczyć wykres." />
				) : !hasDataInRange ? (
					<EmptyState message="Brak transakcji w wybranym zakresie dat." />
				) : (
					<ChartContainer config={chartConfig} className="max-h-92 w-full">
						<BarChart accessibilityLayer data={chartData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey={isMobile ? 'monthShort' : 'month'}
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								interval={isMobile ? 1 : 0}
							/>
							{!isMobile && (
								<YAxis
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									width={56}
									tickFormatter={value => compactNumber.format(Number(value))}
								/>
							)}
							<ChartTooltip
								content={
									<ChartTooltipContent
										formatter={(value, name, item) => (
											<div className="flex w-full items-center justify-between gap-3">
												<span className="text-muted-foreground flex items-center gap-1.5">
													<span
														className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
														style={{ backgroundColor: item.color ?? item.payload?.fill }}
													/>
													{chartConfig[name as keyof typeof chartConfig]?.label ?? name}
												</span>
												<span className="font-mono font-medium tabular-nums">{currency.format(Number(value))}</span>
											</div>
										)}
									/>
								}
							/>
							<ChartLegend content={<ChartLegendContent />} />
							<Bar dataKey="income" fill="var(--chart-income)" radius={4} />
							<Bar dataKey="expenses" fill="var(--chart-expense)" radius={4} />
						</BarChart>
					</ChartContainer>
				)}
			</div>
		</Card>
	)
}

function EmptyState({ message }: { message: string }) {
	return (
		<div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
			<p className="text-muted-foreground text-sm">{message}</p>
		</div>
	)
}
