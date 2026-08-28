'use client'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useModalStore } from '@/stores/useModalStore'
import { TransactionForm } from './TransactionForm'

export function TransactionModal() {
	const activeModal = useModalStore(state => state.activeModal)
	const closeModal = useModalStore(state => state.closeModal)
	const isOpen = activeModal === 'transaction'

	const isDesktop = useMediaQuery('(min-width: 768px)')

	if (isDesktop) {
		return (
			<Dialog open={isOpen} onOpenChange={open => !open && closeModal()}>
				<DialogContent className="sm:max-w-106.25">
					<DialogHeader>
						<DialogTitle>Dodaj Transakcję</DialogTitle>
						<DialogDescription>Wprowadź dane dotyczące nowej transakcji.</DialogDescription>
					</DialogHeader>
					<ProfileForm />
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={isOpen} onOpenChange={open => !open && closeModal()}>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Dodaj Transakcję</DrawerTitle>
					<DrawerDescription>Wprowadź dane dotyczące nowej transakcji.</DrawerDescription>
				</DrawerHeader>
				<ProfileForm className="p-4" />
			</DrawerContent>
		</Drawer>
	)
}

function ProfileForm({ className }: React.ComponentProps<'form'>) {
	return <TransactionForm className={className} />
}
