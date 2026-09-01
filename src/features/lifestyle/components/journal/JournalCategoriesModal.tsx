'use client'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useModalStore, type ModalActionType, type ModalType } from '@/stores/useModalStore'
import { JournalDeleteCategoriesForm } from './JournalDeleteCategoriesForm'
import { JournalCategoriesForm } from './JournalCategoriesForm'

interface JournalCategoriesModalProps {
	type: ModalActionType
	id: string | null | undefined
}

const modalTexts = {
	edit: {
		title: 'Edytuj kategorię',
		description: 'Zmień nazwę, typ lub kolor kategorii.',
	},
	add: {
		title: 'Dodaj nową kategorię',
		description: 'Wprowadź dane dotyczące nowej kategorii.',
	},
	delete: {
		title: 'Usuń kategorię',
		description: '',
	},
}

export function JournalModal({ type, id }: JournalCategoriesModalProps) {
	const activeModal: ModalType = useModalStore(state => state.activeModal)
	const closeModal = useModalStore(state => state.closeModal)

	const isOpen: boolean = activeModal === 'journal-categories'
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

					{type === 'delete' ? <JournalDeleteCategoriesForm id={id} /> : <JournalCategoriesForm id={id} />}
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

				<div className="p-4">
					{type === 'delete' ? <JournalDeleteCategoriesForm id={id} /> : <JournalCategoriesForm id={id} />}
				</div>
			</DrawerContent>
		</Drawer>
	)
}
