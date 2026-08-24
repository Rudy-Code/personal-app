import { useState } from 'react'

import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
	useTable,
	type ColumnDef,
	type ColumnFiltersState,
	type ColumnVisibilityState,
	type RowData,
	type SortingState,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { features, type DataTableFeatures } from './data-table-features'

const columnLabels: Record<string, string> = {
	date: 'Data',
	description: 'Opis',
	category: 'Kategoria',
	account: 'Konto',
	amount: 'Kwota',
	actions: 'Akcje',
}

function getTransactionDateTimestamp(value: unknown) {
	if (typeof value !== 'string') return undefined

	const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
	if (!match) return undefined

	return Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
}

function getInputDateTimestamp(value: string) {
	if (!value) return undefined

	const [year, month, day] = value.split('-').map(Number)
	return Date.UTC(year, month - 1, day)
}

interface DataTableProps<TData extends RowData> {
	columns: ColumnDef<DataTableFeatures, TData>[]
	data: TData[]
}

export function DataTable<TData extends RowData>({ columns, data }: DataTableProps<TData>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({})
	const [category, setCategory] = useState('all')
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')

	const categories = Array.from(
		new Set(
			data
				.map(row => (row as Record<string, unknown>).category)
				.filter((value): value is string => typeof value === 'string')
		)
	).sort()

	const fromTimestamp = getInputDateTimestamp(dateFrom)
	const toTimestamp = getInputDateTimestamp(dateTo)
	const filteredData = data.filter(row => {
		const transaction = row as Record<string, unknown>
		const transactionTimestamp = getTransactionDateTimestamp(transaction.date)
		const isSelectedCategory = category === 'all' || transaction.category === category
		const isAfterStart =
			fromTimestamp === undefined || (transactionTimestamp !== undefined && transactionTimestamp >= fromTimestamp)
		const isBeforeEnd =
			toTimestamp === undefined || (transactionTimestamp !== undefined && transactionTimestamp <= toTimestamp)

		return isSelectedCategory && isAfterStart && isBeforeEnd
	})

	const table = useTable({
		features,
		data: filteredData,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	})

	return (
		<div>
			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3 py-5">
				<div className="relative w-full max-w-sm">
					<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
					<Input
						placeholder="Szukaj transakcji..."
						value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
						onChange={event => table.getColumn('description')?.setFilterValue(event.target.value)}
						className="bg-background/40 border-zinc-600 pl-9 shadow-none focus:border-zinc-300! focus:ring-0!"
					/>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<select
						aria-label="Filtruj po kategorii"
						value={category}
						onChange={event => setCategory(event.target.value)}
						className="bg-app-bg text-foreground h-9 rounded-md border border-zinc-600 px-2.5 text-sm outline-none focus:border-zinc-300! focus:ring-0!"
					>
						<option value="all">Wszystkie kategorie</option>
						{categories.map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
					<label className="text-muted-foreground flex items-center gap-1.5 text-xs">
						Od
						<Input
							type="date"
							aria-label="Data od"
							value={dateFrom}
							onChange={event => setDateFrom(event.target.value)}
							className="bg-background/40 w-36 border-zinc-600 shadow-none"
						/>
					</label>
					<label className="text-muted-foreground flex items-center gap-1.5 text-xs">
						Do
						<Input
							type="date"
							aria-label="Data do"
							value={dateTo}
							onChange={event => setDateTo(event.target.value)}
							className="bg-background/40 w-36 border-zinc-600 shadow-none"
						/>
					</label>
					{(category !== 'all' || dateFrom || dateTo) && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setCategory('all')
								setDateFrom('')
								setDateTo('')
							}}
						>
							<X />
							Wyczyść
						</Button>
					)}
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={<Button variant="outline" size="sm" className="ml-auto border-zinc-600! hover:border-zinc-300!" />}
					>
						<SlidersHorizontal />
						Widok
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter(column => column.getCanHide())
							.map(column => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={value => column.toggleVisibility(!!value)}
									>
										{columnLabels[column.id] ?? column.id}
									</DropdownMenuCheckboxItem>
								)
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* table */}
			<div className="border-border/70 bg-background/25 overflow-hidden rounded-xl border">
				<Table>
					<TableHeader className="bg-background/45">
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id} className="hover:bg-transparent">
								{headerGroup.headers.map(header => {
									return (
										<TableHead
											key={header.id}
											className="text-muted-foreground h-11 px-4 text-[11px] font-bold tracking-wider uppercase first:pl-5 last:pr-5"
										>
											{header.isPlaceholder ? null : <table.FlexRender header={header} />}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className="border-border/60 hover:bg-background/40"
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id} className="px-4 py-3 first:pl-5 last:pr-5">
											<table.FlexRender cell={cell} />
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-muted-foreground h-24 text-center">
									Brak transakcji.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* pagination */}
			<div className="flex items-center justify-between pt-4">
				<div />
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="bg-background/40 shadow-none"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronLeft />
						Poprzednia
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="bg-background/40 shadow-none"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Następna
						<ChevronRight />
					</Button>
				</div>
			</div>
		</div>
	)
}
