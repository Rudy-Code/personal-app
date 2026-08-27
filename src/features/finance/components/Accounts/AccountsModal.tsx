'use client'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useModalStore, type ModalActionType, type ModalType } from '@/stores/useModalStore'

import { AccountsForm } from './AccountsForm'
import { AccountDeleteForm } from './AccountDeleteForm'

interface AccountsModalProps {
	type: ModalActionType
	id: string | null | undefined
}

const modalTexts = {
	edit: {
		title: 'Edytuj Konto',
		description: 'Zmień nazwę, ikonę, kolor czy kwotę konta.',
	},
	add: {
		title: 'Dodaj nowe konto',
		description: 'Wprowadź dane dotyczące nowego konta.',
	},
	delete: {
		title: 'Usuń Konto',
		description: '',
	},
}

export function AccountsModal({ type, id }: AccountsModalProps) {
	const activeModal: ModalType = useModalStore(state => state.activeModal)
	const closeModal = useModalStore(state => state.closeModal)

	const isOpen: boolean = activeModal === 'account'
	const isDesktop = useMediaQuery('(min-width: 768px)')

	const currentText = type ? modalTexts[type] : { title: '', description: '' }

	if (isDesktop) {
		return (
			<Dialog open={isOpen} onOpenChange={open => !open && closeModal()}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{currentText.title}</DialogTitle>
						<DialogDescription>{currentText.description}</DialogDescription>
					</DialogHeader>

					{type === 'delete' ? <AccountDeleteForm id={id} /> : <AccountsForm id={id} />}
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={isOpen} onOpenChange={open => !open && closeModal()}>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{currentText.title}</DrawerTitle>
					<DrawerDescription>{currentText.description}</DrawerDescription>
				</DrawerHeader>

				<div className="p-4">{type === 'delete' ? <AccountDeleteForm id={id} /> : <AccountsForm id={id} />}</div>
			</DrawerContent>
		</Drawer>
	)
}
