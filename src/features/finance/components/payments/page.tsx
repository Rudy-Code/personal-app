import { columns, type Transaction } from './columns'
import { DataTable } from './data-table'

export default function TransactionsPanel() {
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
			<div className="mb-2 flex items-center justify-between">
				<div>
					<h2 className="text-secondary-foreground text-base font-semibold">Ostatnie transakcje</h2>
					<p className="text-secondary-foreground/60 text-sm">Przegląd operacji na Twoich kontach</p>
				</div>
			</div>
			<DataTable columns={columns} data={data} />
		</div>
	)
}
