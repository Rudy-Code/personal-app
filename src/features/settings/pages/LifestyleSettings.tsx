'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { COLORS } from '@/constants/colors'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/stores/useModalStore'
import { EditIcon, MoreHorizontal, PlusIcon, TrashIcon } from 'lucide-react'
import { useJournalStore } from '@/features/lifestyle/stores/useLifestyleStore'

export const LifestyleSettings = () => {
	const categories = useJournalStore(state => state.journalCategories)
	const openModal = useModalStore(state => state.openModal)
	const getCategoryColorClass = (color: string) => COLORS.find(item => item.name === color)?.bg ?? color

	const handleDeleteCategory = (id: string) => {
		openModal('journal-categories', 'delete', id)
	}

	const handleEditCategory = (id: string) => {
		openModal('journal-categories', 'edit', id)
	}

	const handleAddCategory = () => {
		openModal('journal-categories', 'add')
	}

	return (
		<div className="flex flex-col px-4 py-6">
			<h1 className="text-secondary text-2xl font-bold">Ustawienia Stylu Życia</h1>
			<div className="mt-6 grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
				<Card variant="secondary">
					<h2 className="text-secondary text-lg: font-semibold">Kategorie Dziennika</h2>
					<div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-0.5 xl:grid-cols-2">
						{categories.length === 0 ? (
							<p className="text-muted-foreground py-4 text-center text-sm">Brak kategorii w tej sekcji.</p>
						) : (
							categories.map(category => (
								<div
									key={category.id}
									className="group -mx-2 flex cursor-pointer justify-between rounded-xl p-2 transition-colors hover:bg-black/5 sm:items-center"
								>
									<div className="flex items-center gap-3">
										<div
											className={cn(
												'flex size-6 items-center justify-center rounded-full',
												getCategoryColorClass(category.color)
											)}
										/>
										<div>
											<h3 className="text-secondary font-semibold transition-colors">{category.name}</h3>
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
