'use client'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useModalStore } from '@/stores/useModalStore'
import { useFinanceStore } from '../../stores/useFinanceStore'
import { TransactionForm } from './TransactionForm'

export function TransactionModal() {
	const activeModal = useModalStore(state => state.activeModal)
	const closeModal = useModalStore(state => state.closeModal)
	const entityId = useModalStore(state => state.modalEntityId)
	const action = useModalStore(state => state.modalActionType)
	const transaction = useFinanceStore(state => state.transactions.find(t => t.id === entityId))
	const title = action === 'edit' ? 'Edytuj transakcję' : 'Dodaj transakcję'
	const content =
		action === 'edit' && !transaction ? (
			<p>Nie znaleziono transakcji.</p>
		) : (
			<TransactionForm key={entityId ?? 'new'} transaction={transaction} />
		)
	const isOpen = activeModal === 'transaction'

	const isDesktop = useMediaQuery('(min-width: 768px)')

	if (isDesktop) {
		return (
			<Dialog open={isOpen} onOpenChange={open => !open && closeModal()}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-106.25">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>Uzupełnij dane transakcji i zapisz zmiany.</DialogDescription>
					</DialogHeader>
					{isOpen && content}
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={isOpen} onOpenChange={open => !open && closeModal()}>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>Uzupełnij dane transakcji i zapisz zmiany.</DrawerDescription>
				</DrawerHeader>
				<div className="max-h-[70vh] overflow-y-auto p-4">{isOpen && content}</div>
			</DrawerContent>
		</Drawer>
	)
}
