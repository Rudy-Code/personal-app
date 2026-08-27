import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { type IconName } from 'lucide-react/dynamic'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useAccounts } from '../../hook/useAccounts'

export const Accounts = () => {
	const accounts = useAccounts()

	return (
		<Card variant="secondary" className="flex flex-col p-5 md:col-span-2 xl:col-span-1">
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
				{accounts.map(acc => (
					<div
						key={acc.id}
						className="group -mx-2 flex cursor-pointer flex-col justify-between rounded-xl p-2 transition-colors hover:bg-black/5 sm:flex-row sm:items-center"
					>
						<div className="flex items-center gap-3">
							<div className={cn(`flex size-10 items-center justify-center rounded-full text-secondary-foreground`, acc.color)}>
								<DynamicIcon name={acc.icon as IconName} />
							</div>
							<div>
								<h3 className="text-secondary font-semibold transition-colors">{acc.name}</h3>
								<p className="text-secondary/60 text-xs font-medium">{acc.description}</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-secondary font-mono text-base font-bold tracking-tight tabular-nums">
								{acc.currentBalance.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								<span className="text-secondary/60 ml-1 text-xs font-normal">zł</span>
							</p>
						</div>
					</div>
				))}
			</div>
		</Card>
	)
}
