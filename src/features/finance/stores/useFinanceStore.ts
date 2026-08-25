import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { FinanceState } from '../types'

export const useFinanceStore = create<FinanceState>()(
	persist(
		set => ({
			accounts: [
				{
					id: '1',
					name: 'Konto Główne',
					bankName: 'mBank',
					balance: 0,
					icon: 'Landmark',
					color: 'text-emerald-600',
				},
				{
					id: '2',
					name: 'Konto Firmowe',
					bankName: 'mBank',
					balance: 0,
					icon: 'Briefcase',
					color: 'text-blue-600',
				},
				{
					id: '3',
					name: 'Gotówka',
					bankName: 'Portfel',
					balance: 10,
					icon: 'Wallet',
					color: 'text-amber-600',
				},
			],
			categories: [
				{ id: 'c1', name: 'Wynagrodzenie', type: 'income', color: 'bg-emerald-500' },
				{ id: 'c2', name: 'Jedzenie', type: 'expense', color: 'bg-amber-400' },
				{ id: 'c3', name: 'Transport', type: 'expense', color: 'bg-blue-500' },
			],
			transactions: [],
			settings: {
				monthlyExpenseLimit: 800,
				monthlyIncomeGoal: 3500,
			},

			// --- AKCJE ---
			addAccount: newAccount =>
				set(state => ({
					accounts: [...state.accounts, { ...newAccount, id: uuidv4() }],
				})),

			addTransaction: newTransaction =>
				set(state => ({
					transactions: [...state.transactions, { ...newTransaction, id: uuidv4() }],
				})),

			updateTransaction: (id, updatedFields) =>
				set(state => ({
					transactions: state.transactions.map(t => (t.id === id ? { ...t, ...updatedFields } : t)),
				})),

			deleteTransaction: id =>
				set(state => ({
					transactions: state.transactions.filter(t => t.id !== id),
				})),
		}),
		{
			name: 'finance-storage',
		}
	)
)
