import { TransactionModal } from '@/features/finance/components/payments/TransactionModal'
import { useModalStore } from '@/stores/useModalStore'

export const ModalManager = () => {
	const activeModal = useModalStore(state => state.activeModal)

	return (
		<>
			{activeModal === 'transaction' && <TransactionModal />}
			{/* {activeModal === 'account' && <AccountModal />}
		{activeModal === 'settings' && <SettingsModal />} */}
		</>
	)
}
