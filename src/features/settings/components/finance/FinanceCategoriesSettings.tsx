import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/stores/useModalStore'
import { EditIcon, MoreHorizontal, PlusIcon, TrashIcon } from 'lucide-react'

import { useFinanceStore } from '@/features/finance/stores/useFinanceStore'
import { TRANSACTION_TYPE_LABELS } from '@/features/finance/constants'

type categoryViewType = 'expense' | 'income'

export const FinanceCategoriesSettings = () => {
	const categories = useFinanceStore(state => state.categories)
	const openModal = useModalStore(state => state.openModal)

	const [categoryView, setCategoryView] = useState<categoryViewType>('expense')

	const handleDeleteCategory = (id: string) => {
		openModal('category', 'delete', id)
	}

	const handleEditCategory = (id: string) => {
		openModal('category', 'edit', id)
	}

	const handleAddCategory = () => {
		openModal('category', 'add')
	}

	const displayedCategories = categories.filter(category => category.type === categoryView)
	return (
		<Card variant="secondary">
			<div className="mb-4 flex flex-col justify-between sm:flex-row sm:items-center">
				<h2 className="text-secondary/60 mb-1 text-xs font-bold tracking-wider uppercase sm:mb-0">Moje kategorie</h2>

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
							className="group -mx-2 flex cursor-pointer justify-between rounded-xl p-2 transition-colors hover:bg-black/5 sm:items-center"
						>
							<div className="flex items-center gap-3">
								<div className={cn('flex size-6 items-center justify-center rounded-full', category.color)} />
								<div>
									<h3 className="text-secondary font-semibold transition-colors">{category.name}</h3>
									<p className="text-secondary/60 text-xs font-medium">{TRANSACTION_TYPE_LABELS[category.type]}</p>
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
	)
}
