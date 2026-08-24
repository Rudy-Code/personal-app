import { Card } from '@/components/ui/Card'
import { FinanceOverviewChart } from '../components/FinanceOverviewChart'
import { FinanceExpensesChart } from '../components/FinanceExpensesChart'
import { Accounts } from '../components/Accounts'
import { FinanceOverviewInfo } from '../components/FinanceOverviewInfo'

function FinancePage() {
	return (
		<>
			<div className="flex flex-col px-4 py-6">
				<div className="grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
					<FinanceOverviewInfo />

					<Card className="col-span-1 sm:col-span-2 md:col-span-3 md:row-span-2">
						<FinanceOverviewChart />
					</Card>
					<Card variant="secondary">
						<FinanceExpensesChart />
					</Card>

					<Accounts />
				</div>
			</div>
		</>
	)
}

export default FinancePage
