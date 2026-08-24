import { Card } from '@/components/ui/Card'
import { TrendingUp } from 'lucide-react'

export const FinanceOverviewInfo = () => {
	return (
		<>
			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Całkowite saldo</h2>
					</div>
				</div>

				<div className="mt-4">
					<h3 className="text-secondary-foreground text-2xl font-bold sm:text-3xl">22 551,30 zł</h3>
					<p className="mt-2 flex items-center gap-1 text-xs text-green-500">
						<TrendingUp size={14} className="text-emerald-500" />+ 4,2% od ost. miesiąca
					</p>
				</div>
			</Card>

			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex w-full items-center justify-between gap-3">
						<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Przychody (Sierpień)</h2>
					</div>
				</div>

				<div className="mt-4">
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold text-emerald-500 md:text-3xl">+</span>
						<h3 className="text-foreground font-mono text-2xl font-bold tabular-nums sm:text-3xl">3 500,00 zł</h3>
					</div>
					<p className="text-muted-foreground mt-2 text-xs">Zgodnie z planem</p>
				</div>
			</Card>

			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Wydatki (Sierpień)</h2>
					</div>
				</div>

				<div className="mt-4">
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold text-red-500 md:text-3xl">-</span>
						<h3 className="text-foreground font-mono text-2xl font-bold tabular-nums sm:text-3xl">720,40 zł</h3>
					</div>
					<p className="mt-2 text-xs text-amber-400">90% limitu miesięcznego</p>
				</div>
			</Card>

			<Card className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Bilans (Sierpień)</h2>
					</div>
				</div>

				<div className="mt-4">
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold text-emerald-500 md:text-3xl">+</span>
						<h3 className="text-foreground font-mono text-2xl font-bold tabular-nums sm:text-3xl">2 780,90 zł</h3>
					</div>
				</div>
			</Card>
		</>
	)
}
