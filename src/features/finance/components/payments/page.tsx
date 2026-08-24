import { columns, type Payment } from './columns'
import { DataTable } from './data-table'

export default function DemoPage() {
	const data: Payment[] = [
		{
			id: '728ed52f',
			amount: 100,
			status: 'pending',
			email: 'm@example.com',
		},
		{
			id: '728ed52g',
			amount: 200,
			status: 'success',
			email: 'dede@ddd.com',
		},
	]

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={data} />
		</div>
	)
}
