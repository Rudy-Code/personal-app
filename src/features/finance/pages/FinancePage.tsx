import { Card } from '@/components/ui/Card'
import {  TrendingUp } from 'lucide-react'

function FinancePage() {
	return (
		<>
			<div className="flex flex-col px-4 py-6">
				<div className="grid grid-flow-dense grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					<Card className="py-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Całkowite saldo</h2>
							</div>
						</div>

						<div className="mt-4">
							<h3 className="text-secondary-foreground text-3xl font-bold">22 551,30 zł</h3>
							<p className="mt-2 flex items-center gap-1 text-xs text-green-500">
								<TrendingUp size={14} className="text-emerald-500" />+ 4,2% od ost. miesiąca
							</p>
						</div>
					</Card>

					<Card className="py-6">
						<div className="flex items-center justify-between">
							<div className="flex w-full items-center justify-between gap-3">
								<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
									Przychody (Sierpień)
								</h2>
							</div>
						</div>

						<div className="mt-4">
							<div className="flex items-center gap-2">
								<span className="text-3xl font-bold text-emerald-500">+</span>
								<h3 className="text-foreground font-mono text-3xl font-bold tabular-nums">3 500,00 zł</h3>
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
								<span className="text-3xl font-bold text-red-500">-</span>
								<h3 className="text-foreground font-mono text-3xl font-bold tabular-nums">720,40 zł</h3>
							</div>
							<p className="mt-2 text-xs text-amber-400">90% limitu miesięcznego</p>
						</div>
					</Card>

					<Card className="md:col-span-2 md:row-span-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Wydatki (Sierpień)</h2>
							</div>
						</div>

						<div className="mt-4">
							<div className="flex items-center gap-2">
								<span className="text-3xl font-bold text-red-500">-</span>
								<h3 className="text-foreground font-mono text-3xl font-bold tabular-nums">720,40 zł</h3>
							</div>
							<p className="mt-2 text-xs text-amber-400">90% limitu miesięcznego</p>
						</div>
					</Card>
				</div>
			</div>
		</>
	)
}

export default FinancePage
