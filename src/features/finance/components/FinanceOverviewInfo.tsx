import { Card } from '@/components/ui/Card'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useFinanceSummary } from '../hook/useFinanceSummary'
import { formatCurrency, formatDateMonth } from '@/utils/formatters'
import { cn } from '@/lib/utils'

interface FinanceOverviewInfoProps {
	month: number
	year: number
}

const getExpenseLimitUI = (percent: number) => {
	const formattedPercent = Math.round(percent)

	if (percent >= 100) {
		return {
			status: 'Przekroczono limit',
			color: 'text-rose-500',
		}
	}
	if (percent >= 80) {
		return {
			status: `${formattedPercent}% limitu miesięcznego`,
			color: 'text-amber-500',
		}
	}
	return {
		expenseStatus: `${formattedPercent}% limitu miesięcznego`,
		expenseColor: 'text-emerald-500',
	}
}

export const FinanceOverviewInfo = ({ month, year }: FinanceOverviewInfoProps) => {
	const {
		totalBalance,
		balanceGrowthPercent,
		monthlyIncome,
		monthlyExpense,
		monthlyBalance,
		expenseLimitPercent,
		isIncomeOnTrack,
	} = useFinanceSummary(month, year)

	const { expenseStatus, expenseColor } = getExpenseLimitUI(expenseLimitPercent)

	return (
		<>
			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Całkowite saldo</h2>
					</div>
				</div>

				<div className="mt-4">
					<h3 className="text-secondary-foreground truncate text-2xl font-bold sm:text-3xl">
						{formatCurrency(totalBalance)}
					</h3>
					<p
						className={cn(
							'mt-2 flex items-center gap-1 text-xs',
							balanceGrowthPercent >= 0 ? 'text-green-500' : 'text-rose-500'
						)}
					>
						{balanceGrowthPercent >= 0 ? (
							<TrendingUp size={14} className="text-emerald-500" />
						) : (
							<TrendingDown size={14} className="text-rose-500" />
						)}
						{balanceGrowthPercent.toFixed(1)}% od ost. miesiąca
					</p>
				</div>
			</Card>

			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex w-full items-center justify-between gap-3">
						<h2 className="text-muted-foreground truncate text-xs font-bold tracking-wider uppercase">
							Przychody ({formatDateMonth(month)})
						</h2>
					</div>
				</div>

				<div className="mt-4">
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold text-emerald-500 md:text-3xl">+</span>
						<h3 className="text-foreground truncate font-mono text-2xl font-bold tabular-nums sm:text-3xl">
							{formatCurrency(monthlyIncome)}
						</h3>
					</div>
					<p className="text-muted-foreground mt-2 text-xs">{isIncomeOnTrack ? 'Zgodnie z planem' : 'Poza planem'}</p>
				</div>
			</Card>

			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-muted-foreground truncate text-xs font-bold tracking-wider uppercase">
							Wydatki ({formatDateMonth(month)})
						</h2>
					</div>
				</div>

				<div className="mt-4">
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold text-red-500 md:text-3xl">-</span>
						<h3 className="text-foreground truncate font-mono text-2xl font-bold tabular-nums sm:text-3xl">
							{formatCurrency(monthlyExpense)}
						</h3>
					</div>
					<p className={cn('mt-2 text-xs', expenseColor)}>{expenseStatus}</p>
				</div>
			</Card>

			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-muted-foreground truncate text-xs font-bold tracking-wider uppercase">
							Bilans ({formatDateMonth(month)})
						</h2>
					</div>
				</div>

				<div className="mt-4">
					<div className="flex items-center gap-2">
						<span
							className={cn(
								'text-xl font-bold md:text-3xl',
								monthlyBalance <= 0 ? 'text-rose-500' : 'text-emerald-500'
							)}
						>
							{monthlyBalance >= 0 ? '+' : '-'}
						</span>
						<h3
							className={cn(
								'text-foreground truncate font-mono text-2xl font-bold tabular-nums sm:text-3xl',
								monthlyBalance <= 0 ? 'text-rose-500' : 'text-emerald-500'
							)}
						>
							{formatCurrency(monthlyBalance)}
						</h3>
					</div>
				</div>
			</Card>
		</>
	)
}
