import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { columns } from './columns'
import { DataTable } from './data-table'
import { Plus } from 'lucide-react'
import { useModalStore } from '@/stores/useModalStore'
import { useFinanceStore } from '../../stores/useFinanceStore'
import type { TransactionType } from '../../types'

export type EnrichedTransaction = {
	id: string
	date: string
	description: string
	amount: number
	type: TransactionType
	accountName: string
	categoryName: string
}

export default function TransactionsPanel() {
	const openModal = useModalStore(state => state.openModal)
	const rawTransactions = useFinanceStore(state => state.transactions)
	const accounts = useFinanceStore(state => state.accounts)
	const categories = useFinanceStore(state => state.categories)

	const tableData: EnrichedTransaction[] = useMemo(() => {
		return rawTransactions
			.map(t => {
				const account = accounts.find(a => a.id === t.accountId)
				const category = categories.find(c => c.id === t.categoryId)

				return {
					id: t.id,
					date: t.date,
					description: t.description,
					amount: t.amount,
					type: t.type,
					accountName: account ? account.name : 'Nieznane konto',
					categoryName: category ? category.name : t.type === 'transfer' ? '-' : 'Brak kategorii',
				}
			})
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	}, [rawTransactions, accounts, categories])

	return (
		<div>
			<div className="flex items-start justify-between">
				<div>
					<h2 className="text-foreground mt-1 text-lg font-semibold">Ostatnie transakcje</h2>
					<p className="text-muted-foreground mt-1 text-sm">Przegląd operacji na Twoich kontach</p>
				</div>
			</div>

			<DataTable columns={columns} data={tableData} />
			<div className="mt-4">
				<Button variant="default" onClick={() => openModal('transaction')}>
					<Plus className="mr-1" size={16} />
					Dodaj nową transakcję
				</Button>
			</div>
		</div>
	)
}
