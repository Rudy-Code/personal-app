import { useMemo } from 'react'
import { useFinanceStore } from '../stores/useFinanceStore'

export const useAccounts = () => {
	const accounts = useFinanceStore(state => state.accounts)
	const transactions = useFinanceStore(state => state.transactions)

	return useMemo(() => {
		return accounts.map(account => {
			const accountTransactions = transactions.filter(t => t.accountId === account.id || t.toAccountId === account.id)

			const currentBalance = accountTransactions.reduce((sum, t) => {
				if (t.type === 'income' && t.accountId === account.id) {
					return sum + t.amount
				}

				if (t.type === 'expense' && t.accountId === account.id) {
					return sum - t.amount
				}

				if (t.type === 'transfer' && t.accountId === account.id) {
					return sum - t.amount
				}

				if (t.type === 'transfer' && t.toAccountId === account.id) {
					return sum + t.amount
				}

				return sum
			}, account.balance)

			return {
				...account,
				currentBalance,
			}
		})
	}, [accounts, transactions])
}
