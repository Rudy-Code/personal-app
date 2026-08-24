import { createColumnHelper } from '@tanstack/react-table'

import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
			<Button
				variant="ghost"
				size="sm"
				className="-ml-2 px-2 text-muted-foreground hover:text-foreground"
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Data
				<ArrowUpDown className="size-3.5" />
			</Button>
		),
		cell: ({ getValue }) => <span className="text-muted-foreground font-mono text-xs tabular-nums">{getValue()}</span>,
	}),
	columnHelper.accessor('description', {
		header: 'Opis',
		cell: ({ getValue }) => <span className="text-foreground font-medium">{getValue()}</span>,
	}),
	columnHelper.accessor('category', {
		header: 'Kategoria',
		cell: ({ getValue }) => (
			<span className="bg-background/60 text-muted-foreground inline-flex rounded-md px-2 py-1 text-xs font-medium">
				{getValue()}
			</span>
		),
	}),
	columnHelper.accessor('account', {
		header: 'Konto',
		cell: ({ getValue }) => <span className="text-muted-foreground text-sm">{getValue()}</span>,
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
				<div className={`text-right font-mono text-sm font-bold tabular-nums ${amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
					{amount > 0 ? '+' : ''}
					{formatted}
				</div>
			)
		},
	}),
	columnHelper.display({
		id: 'actions',
		header: () => <span className="sr-only">Akcje</span>,
		cell: ({ row }) => {
			const transaction = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="ml-auto" />}>
						<span className="sr-only">Otwórz menu akcji</span>
						<MoreHorizontal className="size-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuGroup>
							<DropdownMenuLabel>Akcje</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction.id)}>
								Kopiuj ID transakcji
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction.description)}>
								Kopiuj opis
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Wyświetl szczegóły</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	}),
])
