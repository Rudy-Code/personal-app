import { Card } from '@/components/ui/Card'
import { FinanceOverviewChart } from '../components/chart/FinanceOverviewChart'
import { FinanceExpensesChart } from '../components/FinanceExpensesChart'
import { Accounts } from '../components/Accounts/Accounts'
import { FinanceOverviewInfo } from '../components/FinanceOverviewInfo'
import TransactionsPanel from '../components/payments/TransactionTable'
import { useState } from 'react'
import { MonthYearPicker } from './../components/MonthYearPicker'

const currentDate = new Date()

function FinancePage() {
	const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1)

	const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear())

	return (
		<>
			<MonthYearPicker
				month={selectedMonth}
				year={selectedYear}
				onChange={(month, year) => {
					setSelectedMonth(month)
					setSelectedYear(year)
				}}
			/>

			<div className="flex flex-col sm:px-4 sm:py-6 mt-4 sm:mt-0">
				<div className="grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
					<FinanceOverviewInfo month={selectedMonth} year={selectedYear} />

					<Card className="col-span-1 sm:col-span-2 md:col-span-3 md:row-span-2">
						<FinanceOverviewChart />
					</Card>
					<Card variant="secondary">
						<FinanceExpensesChart />
					</Card>

					<Accounts />

					<Card className="bg-app-surface/98 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-4">
						<TransactionsPanel />
					</Card>
				</div>
			</div>
		</>
	)
}

export default FinancePage
