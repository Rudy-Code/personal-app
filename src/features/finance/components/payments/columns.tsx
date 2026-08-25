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
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export type Transaction = {
	id: string
	date: string
	description: string
	categoryName: string
	accountName: string
	amount: number
}

const columnHelper = createColumnHelper<DataTableFeatures, Transaction>()

export const columns = columnHelper.columns([
	columnHelper.accessor('date', {
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				className="text-muted-foreground hover:text-foreground -ml-2 px-2"
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Data
				<ArrowUpDown className="size-3.5" />
			</Button>
		),
		cell: ({ row }) => {
			return format(new Date(row.getValue('date')), 'dd MMM yyyy', { locale: pl })
		},
	}),
	columnHelper.accessor('description', {
		header: 'Opis',
		cell: ({ getValue }) => <span className="text-foreground font-medium">{getValue()}</span>,
	}),
	columnHelper.accessor('categoryName', {
		header: 'Kategoria',
		cell: ({ getValue }) => (
			<span className="bg-background/60 text-muted-foreground inline-flex rounded-md px-2 py-1 text-xs font-medium">
				{getValue()}
			</span>
		),
	}),
	columnHelper.accessor('accountName', {
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
				<div
					className={`text-right font-mono text-sm font-bold tabular-nums ${amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}
				>
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
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction.amount.toString())}>
								Kopiuj kwotę
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							{/* TODO: AKCJE */}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	}),
])
