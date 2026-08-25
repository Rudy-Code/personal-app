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
	bankName: string
	balance: number
	icon: string
	color: string
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
	addAccount: (a: Omit<Account, 'id'>) => void
	addTransaction: (t: Omit<Transaction, 'id'>) => void
	updateTransaction: (id: string, updatedFields: Partial<Transaction>) => void
	deleteTransaction: (id: string) => void
}
