import { create } from 'zustand'

export type ModalType = 'transaction' | 'account' | 'category' | 'settings' | null
export type ModalActionType = 'add' | 'edit' | 'delete' | null | undefined

interface ModalState {
	activeModal: ModalType
	modalActionType?: ModalActionType
	modalEntityId?: string | null
	openModal: (modal: ModalType, actionType?: ModalActionType, entityId?: string | null) => void
	closeModal: () => void
}

export const useModalStore = create<ModalState>(set => ({
	activeModal: null,
	modalActionType: null,
	modalEntityId: null,

	openModal: (modal, actionType = null, entityId = null) =>
		set({
			activeModal: modal,
			modalActionType: actionType,
			modalEntityId: entityId,
		}),

	closeModal: () =>
		set({
			activeModal: null,
			modalActionType: null,
			modalEntityId: null,
		}),
}))
