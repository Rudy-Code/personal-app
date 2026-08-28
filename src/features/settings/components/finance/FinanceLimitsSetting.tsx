import { Card } from '@/components/ui/Card'
import { useFinanceStore } from '@/features/finance/stores/useFinanceStore'
import { FinanceLimitRowSettings } from './FinanceLimitRowSettings'
import { LIMITS_SETTINGS_LABEL } from '@/features/finance/constants'

export const FinanceLimitsSetting = () => {
	const settings = useFinanceStore(state => state.settings)
	const updateSetting = useFinanceStore(state => state.updateSetting)

	return (
		<Card variant="secondary">
			<div className="mb-2 pb-4">
				<h2 className="text-secondary/60 text-xs font-bold tracking-wider uppercase">
					Moje limity i cele (miesięczne)
				</h2>
			</div>

			<div className="flex flex-col gap-4">
				<FinanceLimitRowSettings
					label={`${LIMITS_SETTINGS_LABEL.monthlyExpenseLimit}:`}
					settingKey="monthlyExpenseLimit"
					currentValue={settings.monthlyExpenseLimit}
					onSave={updateSetting}
				/>

				<FinanceLimitRowSettings
					label={`${LIMITS_SETTINGS_LABEL.monthlyIncomeGoal}:`}
					settingKey="monthlyIncomeGoal"
					currentValue={settings.monthlyIncomeGoal}
					onSave={updateSetting}
				/>
			</div>
		</Card>
	)
}
