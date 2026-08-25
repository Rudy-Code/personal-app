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
						<DialogTitle>Edit profile</DialogTitle>
						<DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
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
					<DrawerTitle>Edit profile</DrawerTitle>
					<DrawerDescription>Make changes to your profile here. Click save when you&apos;re done.</DrawerDescription>
				</DrawerHeader>
				<ProfileForm className="p-4" />
			</DrawerContent>
		</Drawer>
	)
}

function ProfileForm({ className }: React.ComponentProps<'form'>) {
	return <TransactionForm className={className} />
}
