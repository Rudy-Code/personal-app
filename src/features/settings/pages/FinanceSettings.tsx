import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAccounts } from '@/features/finance/hook/useAccounts'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/stores/useModalStore'
import { EditIcon, MoreHorizontal, PlusIcon, TrashIcon } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

export const FinanceSettings = () => {
	const accounts = useAccounts()
	const openModal = useModalStore(state => state.openModal)

	// const { addAccount, updateAccount, deleteAccount } = useFinanceStore()

	const handleDeleteAccount = (id: string) => {
		// confirm modal
		// deleteAccount(id)
		openModal('account', 'delete', id)
	}

	const handleEditAccount = (id: string) => {
		openModal('account', 'edit', id)
	}

	const handleAddAccount = () => {
		openModal('account', 'add')
	}

	return (
		<div className="flex flex-col px-4 py-6">
			<h1 className="text-secondary text-2xl font-bold">Finanse Ustawienia</h1>
			<div className="mt-2">
				<Card variant="secondary">
					<div className="">
						<h2 className="text-secondary/60 text-xs font-bold tracking-wider uppercase">Moje Konta</h2>
					</div>
					<div className="mt-2 flex flex-col gap-0.5">
						{accounts.map(acc => (
							<div
								key={acc.id}
								className="group -mx-2 flex cursor-pointer flex-col justify-between rounded-xl p-2 transition-colors hover:bg-black/5 sm:flex-row sm:items-center"
							>
								<div className="flex items-center gap-3">
									<div
										className={cn(
											`text-secondary-foreground flex size-10 items-center justify-center rounded-full`,
											acc.color
										)}
									>
										<DynamicIcon name={acc.icon as IconName} />
									</div>
									<div>
										<h3 className="text-secondary font-semibold transition-colors">{acc.name}</h3>
										<p className="text-secondary/60 text-xs font-medium">{acc.description}</p>
									</div>
								</div>
								<div className="flex items-center gap-2 text-right">
									<p className="text-secondary font-mono text-base font-bold tracking-tight tabular-nums">
										{acc.currentBalance.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
										<span className="text-secondary/60 ml-1 text-xs font-normal">zł</span>
									</p>
									<div className="">
										<DropdownMenu>
											<DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
												<span className="sr-only">Otwórz menu akcji</span>
												<MoreHorizontal className="size-4" />
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem className="flex" onClick={() => handleEditAccount(acc.id)}>
													<EditIcon />
													Edytuj
												</DropdownMenuItem>

												<DropdownMenuItem variant="destructive" onClick={() => handleDeleteAccount(acc.id)}>
													<TrashIcon />
													Usuń
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="mt-6">
						<Button onClick={() => handleAddAccount()}>
							<PlusIcon /> Dodaj konto
						</Button>
					</div>
				</Card>
			</div>
		</div>
	)
}
