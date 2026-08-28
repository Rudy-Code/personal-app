'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAccounts } from '@/features/finance/hook/useAccounts'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/stores/useModalStore'
import { EditIcon, MoreHorizontal, PlusIcon, TrashIcon } from 'lucide-react'
import { formatCurrencyWithoutCurrency } from '@/utils/formatters'
import { useFinanceStore } from '@/features/finance/stores/useFinanceStore'
import { getAccountIcon, TRANSACTION_TYPE_LABELS } from '@/features/finance/constants'

type viewType = 'active' | 'archived'
type categoryViewType = 'expense' | 'income'

export const FinanceSettings = () => {
	const accounts = useAccounts()
	const categories = useFinanceStore(state => state.categories)
	const openModal = useModalStore(state => state.openModal)

	const [view, setView] = useState<viewType>('active')
	const [categoryView, setCategoryView] = useState<categoryViewType>('expense')

	const handleDeleteAccount = (id: string) => {
		openModal('account', 'delete', id)
	}

	const handleEditAccount = (id: string) => {
		openModal('account', 'edit', id)
	}

	const handleAddAccount = () => {
		openModal('account', 'add')
	}

	const handleDeleteCategory = (id: string) => {
		openModal('category', 'delete', id)
	}

	const handleEditCategory = (id: string) => {
		openModal('category', 'edit', id)
	}

	const handleAddCategory = () => {
		openModal('category', 'add')
	}

	const displayedAccounts = accounts.filter(acc => (view === 'active' ? !acc.isArchived : acc.isArchived))
	const displayedCategories = categories.filter(category => category.type === categoryView)

	return (
		<div className="flex flex-col px-4 py-6">
			<h1 className="text-secondary text-2xl font-bold">Ustawienia Finansów</h1>

			<div className="mt-6 grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
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

				<Card variant="secondary">
					<div className="flex items-center justify-between">
						<h2 className="text-secondary/60 text-xs font-bold tracking-wider uppercase">Moje limity</h2>
					</div>
				</Card>

				<Card variant="secondary">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-secondary/60 text-xs font-bold tracking-wider uppercase">Moje kategorie</h2>

						<Tabs value={categoryView} onValueChange={v => setCategoryView(v as categoryViewType)}>
							<TabsList className="h-8">
								<TabsTrigger value="expense" className="px-3 text-xs">
									Wydatki
								</TabsTrigger>
								<TabsTrigger value="income" className="px-3 text-xs">
									Wpływy
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<div className="flex flex-col gap-0.5">
						{displayedCategories.length === 0 ? (
							<p className="text-muted-foreground py-4 text-center text-sm">Brak kategorii w tej sekcji.</p>
						) : (
							displayedCategories.map(category => (
								<div
									key={category.id}
									className="group -mx-2 flex cursor-pointer flex-col justify-between rounded-xl p-2 transition-colors hover:bg-black/5 sm:flex-row sm:items-center"
								>
									<div className="flex items-center gap-3">
										<div className={cn('flex size-6 items-center justify-center rounded-full', category.color)} />
										<div>
											<h3 className="text-secondary font-semibold transition-colors">{category.name}</h3>
											<p className="text-secondary/60 text-xs font-medium">
												{TRANSACTION_TYPE_LABELS[category.type]}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2 text-right">
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
													<DropdownMenuItem onClick={() => handleEditCategory(category.id)}>
														<EditIcon className="mr-2 size-4" />
														Edytuj
													</DropdownMenuItem>
													<DropdownMenuItem variant="destructive" onClick={() => handleDeleteCategory(category.id)}>
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
						<Button onClick={handleAddCategory}>
							<PlusIcon className="mr-2 size-4" /> Dodaj kategorię
						</Button>
					</div>
				</Card>
			</div>
		</div>
	)
}
