import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { LIMITS_SETTINGS_LABEL } from '@/features/finance/constants'
import { useState } from 'react'

export const FinanceLimitRowSettings = ({
	label,
	settingKey,
	currentValue,
	onSave,
}: {
	label: string
	settingKey: 'monthlyExpenseLimit' | 'monthlyIncomeGoal'
	currentValue: number
	onSave: (key: 'monthlyExpenseLimit' | 'monthlyIncomeGoal', val: number) => void
}) => {
	const [inputValue, setInputValue] = useState(String(currentValue))
	const [error, setError] = useState('')

	const handleSave = () => {
		const numericValue = parseFloat(inputValue)

		if (isNaN(numericValue) || numericValue < 0) {
			setError('Kwota musi być większa lub równa 0')
			return
		}

		setError('')
		onSave(settingKey, numericValue)
		toast.add({
			type: 'success',
			description: `Zmieniono ${LIMITS_SETTINGS_LABEL[settingKey].toLowerCase()} na: ${numericValue}zł`,
		})
		console.log(`Zapisano ${settingKey}:`, numericValue)
	}

	return (
		<div className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<p className="text-sm font-medium">{label}</p>
			</div>

			<div className="flex w-full flex-col sm:w-auto">
				<div className="flex w-full items-center gap-2">
					<div className="relative flex-1 sm:w-48">
						<Input
							type="number"
							min="0"
							placeholder="Np. 2500"
							value={inputValue}
							onChange={e => {
								setInputValue(e.target.value)
								if (error) setError('')
							}}
							className={`w-full pr-8 shadow-none focus:ring-0! ${
								error ? 'border-red-500 focus:border-red-500' : 'border-zinc-600'
							}`}
						/>
						<span className="text-secondary/60 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm">
							zł
						</span>
					</div>
					<Button variant="secondary" className="shrink-0" onClick={handleSave}>
						Zapisz
					</Button>
				</div>
				{error && <span className="mt-1 text-xs font-medium text-red-500">{error}</span>}
			</div>
		</div>
	)
}
