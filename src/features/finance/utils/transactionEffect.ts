import type { Transaction } from '../types'

export function transactionEffect(t: Transaction, accountId: string): number {
	if (t.accountId === accountId) return t.type === 'income' ? t.amount : -t.amount
	if (t.type === 'transfer' && t.toAccountId === accountId) return t.amount
	return 0
}
