'use client'

import { Button } from '@/components/ui/button'
import { useModalStore } from '@/stores/useModalStore'
import { useJournalStore } from '@/features/lifestyle/stores/useLifestyleStore'
import { toast } from '@/components/ui/toast'

export function JournalDeleteCategoriesForm({ id }: { id?: string | null }) {
	const { deleteCategory, journalCategories } = useJournalStore()
	const closeModal = useModalStore(state => state.closeModal)

	const category = journalCategories.find(c => c.id === id)
	if (!category) return null

	function handleDelete() {
		if (id) {
			deleteCategory(id)
			closeModal()
            toast.add({
                type: 'success',
                title: 'Kategoria usunięta',
                description: `Kategoria "${category?.name}" została usunięta.`,
               
            })
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
						Ta operacja usunie kategorię. Wszystkie wpisy, które z niej korzystają, stracą przypisanie. Tej akcji nie
						można cofnąć.
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
