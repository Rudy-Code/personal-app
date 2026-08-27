import { AccountsModal } from '@/features/finance/components/Accounts/AccountsModal'
import { TransactionModal } from '@/features/finance/components/payments/TransactionModal'
import { useModalStore } from '@/stores/useModalStore'

export const ModalManager = () => {
	const activeModal = useModalStore(state => state.activeModal)
	const modalActionType = useModalStore(state => state.modalActionType)
	const entityId = useModalStore(state => state.modalEntityId)

	return (
		<>
			{activeModal === 'transaction' && <TransactionModal />}
			{activeModal === 'account' && <AccountsModal type={modalActionType} id={entityId} />}
			{/* {activeModal === 'settings' && <SettingsModal />}  */}
		</>
	)
}
