import { useState } from 'react'
import { cn } from '@/lib/utils'

import { Card } from '@/components/ui/Card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { getAccountIcon } from '@/features/finance/constants'
import { useAccounts } from '@/features/finance/hook/useAccounts'
import { useModalStore } from '@/stores/useModalStore'
import { formatCurrencyWithoutCurrency } from '@/utils/formatters'
import { Button } from '@/components/ui/button'
import { EditIcon, MoreHorizontal, PlusIcon, TrashIcon } from 'lucide-react'

type viewType = 'active' | 'archived'

export const FinanceAccountsSettings = () => {
	const accounts = useAccounts()
	const openModal = useModalStore(state => state.openModal)
	const [view, setView] = useState<viewType>('active')

	const handleDeleteAccount = (id: string) => {
		openModal('account', 'delete', id)
	}

	const handleEditAccount = (id: string) => {
		openModal('account', 'edit', id)
	}

	const handleAddAccount = () => {
		openModal('account', 'add')
	}

	const displayedAccounts = accounts.filter(acc => (view === 'active' ? !acc.isArchived : acc.isArchived))

	return (
		<Card variant="secondary">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-secondary/60 text-xs font-bold tracking-wider uppercase">Moje Konta</h2>

				<Tabs value={view} onValueChange={(v: viewType) => setView(v as viewType)}>
					<TabsList className="h-8">
						<TabsTrigger value="active" className="px-3 text-xs">
							Aktywne
						</TabsTrigger>
						<TabsTrigger value="archived" className="px-3 text-xs">
							Archiwum
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="flex flex-col gap-0.5">
				{displayedAccounts.length === 0 ? (
					<p className="text-muted-foreground py-4 text-center text-sm">Brak kont w tej sekcji.</p>
				) : (
					displayedAccounts.map(acc => (
						<div
							key={acc.id}
							className={cn(
								'group -mx-2 flex cursor-pointer flex-col justify-between rounded-xl p-2 transition-colors hover:bg-black/5 sm:flex-row sm:items-center',
								acc.isArchived && 'opacity-75 grayscale'
							)}
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										`text-secondary-foreground flex size-10 items-center justify-center rounded-full`,
										acc.color
									)}
								>
									{(() => {
										const Icon = getAccountIcon(acc.icon)
										return <Icon />
									})()}
								</div>
								<div>
									<h3 className="text-secondary font-semibold transition-colors">{acc.name}</h3>
									<p className="text-secondary/60 text-xs font-medium">
										{acc.description} {acc.isArchived && '(Zarchiwizowane)'}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2 text-right">
								<p className="text-secondary font-mono text-base font-bold tracking-tight tabular-nums">
									{formatCurrencyWithoutCurrency(acc.currentBalance)}
									<span className="text-secondary/60 text-xs font-normal">zł</span>
								</p>
								<div>
									<DropdownMenu>
										<DropdownMenuTrigger
											render={
												<Button variant="ghost" size="icon-sm">
													<span className="sr-only">Otwórz menu akcji</span>
													<MoreHorizontal className="size-4" />
												</Button>
											}
										></DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-full">
											<DropdownMenuItem onClick={() => handleEditAccount(acc.id)}>
												<EditIcon className="mr-2 size-4" />
												Edytuj
											</DropdownMenuItem>
											<DropdownMenuItem variant="destructive" onClick={() => handleDeleteAccount(acc.id)}>
												<TrashIcon className="mr-2 size-4" />
												Usuń
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						</div>
					))
				)}
			</div>

			<div className="mt-6">
				<Button onClick={handleAddAccount}>
					<PlusIcon className="mr-2 size-4" /> Dodaj konto
				</Button>
			</div>
		</Card>
	)
}
