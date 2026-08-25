import { Button } from '@/components/ui/button'
import { columns, type Transaction } from './columns'
import { DataTable } from './data-table'
import { Plus } from 'lucide-react'
import { useModalStore } from '@/stores/useModalStore'

export default function TransactionsPanel() {
	const openModal = useModalStore(state => state.openModal)

	const data: Transaction[] = [
		{
			id: '728ed52f',
			date: '25.08.2026',
			description: 'Wypłata',
			category: 'Wynagrodzenie',
			account: 'Konto Główne',
			amount: 5800,
		},
		{
			id: '728ed52g',
			date: '24.08.2026',
			description: 'Zakupy spożywcze',
			category: 'Jedzenie',
			account: 'Konto Główne',
			amount: -186.42,
		},
		{
			id: '728ed52h',
			date: '23.08.2026',
			description: 'Bilet miesięczny',
			category: 'Transport',
			account: 'Konto Główne',
			amount: -119,
		},
		{
			id: '728ed52i',
			date: '22.08.2026',
			description: 'Przelew na oszczędności',
			category: 'Oszczędności',
			account: 'Konto Firmowe',
			amount: -1000,
		},
	]

	return (
		<div>
			<div className="flex items-start justify-between">
				<div>
					<h2 className="text-foreground mt-1 text-lg font-semibold">Ostatnie transakcje</h2>
					<p className="text-muted-foreground mt-1 text-sm">Przegląd operacji na Twoich kontach</p>
				</div>
			</div>
			<DataTable columns={columns} data={data} />
			<div className="mt-2">
				<Button variant="default" className="" onClick={() => openModal('transaction')}>
					<Plus className="mr-1" size={14} />
					Dodaj nową transakcję
				</Button>
			</div>
		</div>
	)
}
