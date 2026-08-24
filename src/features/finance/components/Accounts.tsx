import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Plus, Landmark, Briefcase, Wallet } from 'lucide-react'

const accountsData = [
	{
		id: '1',
		name: 'Konto Główne',
		bank: 'mBank',
		balance: 12450.4,
		icon: Landmark,
		iconColor: 'text-emerald-600', // Lekko przyciemniony dla lepszego kontrastu na białym
		iconBg: 'bg-emerald-500/15',
	},
	{
		id: '2',
		name: 'Konto Firmowe',
		bank: 'mBank',
		balance: 12450.4,
		icon: Briefcase,
		iconColor: 'text-blue-600',
		iconBg: 'bg-blue-500/15',
	},
	{
		id: '3',
		name: 'Gotówka',
		bank: 'Portfel',
		balance: 350.0,
		icon: Wallet,
		iconColor: 'text-amber-600',
		iconBg: 'bg-amber-500/15',
	},
]

export const Accounts = () => {
	return (
		<Card variant="secondary" className="flex flex-col p-5 md:col-span-2 xl:col-span-1">
			{/* NAGŁÓWEK */}
			<div className="mb-2 flex w-full items-center justify-between">
				<h2 className="text-secondary/60 text-xs font-bold tracking-wider uppercase">Moje Konta</h2>
				<Button
					variant="ghost"
					size="icon-xs"

					onClick={() => console.log('Dodaj konto')}
				>
					<Plus size={16} />
				</Button>
			</div>

			<div className="flex flex-col gap-1">
				{accountsData.map(acc => (
					<div
						key={acc.id}
						className="group -mx-2 flex cursor-pointer flex-col justify-between rounded-xl p-2 transition-colors hover:bg-black/5 sm:flex-row sm:items-center"
					>
						<div className="flex items-center gap-3">
							<div className={cn(`flex size-10 items-center justify-center rounded-full`, acc.iconBg, acc.iconColor)}>
								<acc.icon size={18} />
							</div>
							<div>
								<h3 className="text-secondary font-semibold transition-colors">{acc.name}</h3>
								<p className="text-secondary/60 text-xs font-medium">{acc.bank}</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-secondary font-mono text-base font-bold tracking-tight tabular-nums">
								{acc.balance.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								<span className="text-secondary/60 ml-1 text-xs font-normal">zł</span>
							</p>
						</div>
					</div>
				))}
			</div>
		</Card>
	)
}
