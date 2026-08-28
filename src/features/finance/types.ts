import type { IconName } from 'lucide-react/dynamic'

export type TransactionType = 'income' | 'expense' | 'transfer'

export interface Category {
	id: string
	name: string
	type: 'income' | 'expense'
	color: string
	icon?: string
}

export interface Account {
	id: string
	name: string
	balance: number
	icon: IconName
	color: string
	description?: string
	isArchived?: boolean
}

export interface Transaction {
	id: string
	date: string
	description: string
	amount: number
	type: TransactionType
	categoryId?: string
	accountId: string
	toAccountId?: string
}

export interface FinanceState {
	accounts: Account[]
	categories: Category[]
	transactions: Transaction[]
	settings: {
		monthlyExpenseLimit: number
		monthlyIncomeGoal: number
	}

	// Akcje
	addAccount: (newAccount: Omit<Account, 'id'>) => void
	updateAccount: (id: string, updatedFields: Partial<Account>) => void
	archiveAccount: (id: string) => void
	deleteAccount: (id: string) => void

	addTransaction: (t: Omit<Transaction, 'id'>) => void
	updateTransaction: (id: string, updatedFields: Partial<Transaction>) => void
	deleteTransaction: (id: string) => void

	addCategory: (newCategory: Omit<Category, 'id'>) => void
	updateCategory: (id: string, updatedFields: Partial<Category>) => void
	deleteCategory: (id: string) => void

	updateSetting: (key: keyof FinanceState['settings'], value: number) => void
}
