'use client'

import { Button } from '@/components/ui/button'
import { useFinanceStore } from '../../stores/useFinanceStore'
import { useModalStore } from '@/stores/useModalStore'

export function CategoryDeleteForm({ id }: { id?: string | null }) {
	const { deleteCategory, categories } = useFinanceStore()
	const closeModal = useModalStore(state => state.closeModal)

	const category = categories.find(c => c.id === id)
	if (!category) return null

	function handleDelete() {
		if (id) {
			deleteCategory(id)
			closeModal()
		}
	}

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground mb-4 text-sm">
				Czy na pewno chcesz usunąć kategorię <strong className="text-foreground">{category.name}</strong>?
			</p>

			<div className="border-destructive/50 bg-destructive/10 space-y-3 rounded-lg border p-4">
				<div>
					<h4 className="text-secondary-foreground text-sm font-semibold">Usuń trwale</h4>
					<p className="text-muted-foreground mt-1 text-xs leading-relaxed">
						Ta operacja usunie kategorię. Transakcje, które z niej korzystają, stracą przypisanie. Tej akcji nie można
						cofnąć.
					</p>
				</div>
				<Button variant="destructive" className="w-full" onClick={handleDelete}>
					Usuń bezpowrotnie
				</Button>
			</div>

			<div className="flex justify-center pt-2">
				<Button variant="secondary" className="w-full" onClick={() => closeModal()}>
					Anuluj
				</Button>
			</div>
		</div>
	)
}
