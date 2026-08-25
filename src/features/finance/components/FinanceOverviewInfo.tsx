import { Card } from '@/components/ui/Card'
import { TrendingUp } from 'lucide-react'
import { useFinanceSummary } from '../hook/useFinanceSummary'
import { formatCurrency, formatDateMonth } from '@/utils/formatters'

interface FinanceOverviewInfoProps {
	month: number
	year: number
}

export const FinanceOverviewInfo = ({ month, year }: FinanceOverviewInfoProps) => {
	const { totalBalance, balanceGrowthPercent, monthlyIncome, monthlyExpense, monthlyBalance } = useFinanceSummary()

	return (
		<>
			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Całkowite saldo</h2>
					</div>
				</div>

				<div className="mt-4">
					<h3 className="text-secondary-foreground text-2xl font-bold sm:text-3xl">{formatCurrency(totalBalance)}</h3>
					<p className="mt-2 flex items-center gap-1 text-xs text-green-500">
						{/* TODO: Zmiana kolorow, ikon w zalezności od wartości */}
						<TrendingUp size={14} className="text-emerald-500" />
						{balanceGrowthPercent.toFixed(1)}% od ost. miesiąca
					</p>
				</div>
			</Card>

			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex w-full items-center justify-between gap-3">
						<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
							{formatCurrency(monthlyIncome)} ({formatDateMonth(month)})
						</h2>
					</div>
				</div>

				<div className="mt-4">
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold text-emerald-500 md:text-3xl">+</span>
						<h3 className="text-foreground font-mono text-2xl font-bold tabular-nums sm:text-3xl">
							{formatCurrency(monthlyIncome)}
						</h3>
					</div>
					<p className="text-muted-foreground mt-2 text-xs">Zgodnie z planem</p>
				</div>
			</Card>

			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
							{formatCurrency(monthlyExpense)} ({formatDateMonth(month)})
						</h2>
					</div>
				</div>

				<div className="mt-4">
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold text-red-500 md:text-3xl">-</span>
						<h3 className="text-foreground font-mono text-2xl font-bold tabular-nums sm:text-3xl">
							{formatCurrency(monthlyExpense)}
						</h3>
					</div>
					<p className="mt-2 text-xs text-amber-400">90% limitu miesięcznego</p>
				</div>
			</Card>

			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
							Bilans ({formatDateMonth(month)})
						</h2>
					</div>
				</div>

				<div className="mt-4">
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold text-emerald-500 md:text-3xl">+</span>
						<h3 className="text-foreground font-mono text-2xl font-bold tabular-nums sm:text-3xl">
							{formatCurrency(monthlyBalance)}
						</h3>
					</div>
				</div>
			</Card>
		</>
	)
}
