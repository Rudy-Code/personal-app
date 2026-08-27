'use client'

import { Button } from '@/components/ui/button'
import { useFinanceStore } from '../../stores/useFinanceStore'
import { useModalStore } from '@/stores/useModalStore'

export function AccountDeleteForm({ id }: { id?: string | null }) {
	const { deleteAccount, archiveAccount, accounts } = useFinanceStore()
	const closeModal = useModalStore(state => state.closeModal)

	const account = accounts.find(a => a.id === id)
	if (!account) return null

	function handleArchive() {
		if (id) {
			archiveAccount(id)
			closeModal()
		}
	}

	function handleDelete() {
		if (id) {
			deleteAccount(id)
			closeModal()
		}
	}

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground mb-4 text-sm">
				Wybierz, co chcesz zrobić z kontem <strong className="text-foreground">{account.name}</strong>.
			</p>

			<div className="space-y-3 rounded-lg border p-4">
				<div>
					<h4 className="text-sm font-semibold">Archiwizuj konto (Zalecane)</h4>
					<p className="text-muted-foreground mt-1 text-xs leading-relaxed">
						Konto zniknie z głównej listy, ale zachowasz historię transakcji i statystyki. Nie będzie można dodawać do
						niego nowych operacji.
					</p>
				</div>
				<Button variant="secondary" className="w-full" onClick={handleArchive}>
					Zarchiwizuj konto
				</Button>
			</div>

			<div className="border-destructive/50 bg-destructive/10 space-y-3 rounded-lg border p-4">
				<div>
					<h4 className="text-secondary-foreground text-sm font-semibold">Usuń trwale</h4>
					<p className="text-muted-foreground mt-1 text-xs leading-relaxed">
						Ta operacja usunie konto oraz <strong>wszystkie powiązane z nim transakcje</strong>. Tej akcji nie można
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
