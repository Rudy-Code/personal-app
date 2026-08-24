import { createColumnHelper } from '@tanstack/react-table'

import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { type DataTableFeatures } from './data-table-features'

export type Transaction = {
	id: string
	date: string
	description: string
	category: string
	account: string
	amount: number
}

const columnHelper = createColumnHelper<DataTableFeatures, Transaction>()

export const columns = columnHelper.columns([
	columnHelper.accessor('date', {
		header: ({ column }) => (
			<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
				Data
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
	}),
	columnHelper.accessor('description', {
		header: 'Opis',
	}),
	columnHelper.accessor('category', {
		header: 'Kategoria',
	}),
	columnHelper.accessor('account', {
		header: 'Konto',
	}),
	columnHelper.accessor('amount', {
		header: () => <div className="text-right">Kwota</div>,
		cell: ({ row }) => {
			const amount = row.getValue<number>('amount')
			const formatted = new Intl.NumberFormat('pl-PL', {
				style: 'currency',
				currency: 'PLN',
			}).format(amount)

			return (
				<div className={`text-right font-medium tabular-nums ${amount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
					{formatted}
				</div>
			)
		},
	}),
])
