import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { FinanceState } from '../types'

export const useFinanceStore = create<FinanceState>()(
	persist(
		set => ({
			accounts: [],
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

			// ------ AKCJE ------

			// --- KONTA ---
			addAccount: newAccount =>
				set(state => ({
					accounts: [...state.accounts, { ...newAccount, id: uuidv4() }],
				})),

			updateAccount: (id, updatedFields) =>
				set(state => ({
					accounts: state.accounts.map(acc => (acc.id === id ? { ...acc, ...updatedFields } : acc)),
				})),

			archiveAccount: (id: string) =>
				set(state => ({
					accounts: state.accounts.map(a => (a.id === id ? { ...a, isArchived: true } : a)),
				})),

			deleteAccount: id =>
				set(state => ({
					accounts: state.accounts.filter(acc => acc.id !== id),
					transactions: state.transactions.filter(t => t.accountId !== id && t.toAccountId !== id),
				})),

			// --- TRANSAKCJE ---
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

			// --- KATEGORIE ---
			addCategory: newCategory =>
				set(state => ({
					categories: [...state.categories, { ...newCategory, id: uuidv4() }],
				})),
			updateCategory: (id, updatedFields) =>
				set(state => ({
					categories: state.categories.map(category =>
						category.id === id ? { ...category, ...updatedFields } : category
					),
				})),
			deleteCategory: id =>
				set(state => ({
					categories: state.categories.filter(t => t.id !== id),
				})),
		}),
		{
			name: 'finance-storage',
		}
	)
)
