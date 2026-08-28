'use client'

import { FinanceLimitsSetting } from '../components/finance/FinanceLimitsSetting'
import { FinanceAccountsSettings } from '../components/finance/FinanceAccountsSettings'
import { FinanceCategoriesSettings } from '../components/finance/FinanceCategoriesSettings'

export const FinanceSettings = () => {
	return (
		<div className="flex flex-col px-4 py-6">
			<h1 className="text-secondary text-2xl font-bold">Ustawienia Finansów</h1>

			<div className="mt-6 grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
				<FinanceAccountsSettings />

				<FinanceLimitsSetting />

				<FinanceCategoriesSettings />
			</div>
		</div>
	)
}
