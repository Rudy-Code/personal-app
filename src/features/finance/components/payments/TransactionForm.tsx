import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as z from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TRANSACTION_TYPE_LABELS } from '../../constants'

import { useModalStore } from '@/stores/useModalStore'
import { useFinanceStore } from '../../stores/useFinanceStore'
import { useAccounts } from '../../hook/useAccounts'

// TODO: get accounts from store, not hardcoded

const transactionFormSchema = z.object({
	type: z.enum(['income', 'expense'], {
		required_error: 'Wybierz typ transakcji.',
	}),
	amount: z.coerce.number({ invalid_type_error: 'Podaj poprawną kwotę.' }).positive('Kwota musi być większa od zera.'),
	date: z.date({ required_error: 'Wybierz datę.' }),
	account: z.string().min(1, 'Wybierz konto.'),
	description: z
		.string()
		.min(3, 'Opis musi mieć co najmniej 3 znaki.')
		.max(120, 'Opis może mieć maksymalnie 120 znaków.'),
})

type TransactionFormValues = z.infer<typeof transactionFormSchema>

export function TransactionForm({
	className,
	onSuccess,
}: {
	className?: string
	onSuccess?: (values: TransactionFormValues) => void
}) {
	const accounts = useAccounts()

	const addTransaction = useFinanceStore(state => state.addTransaction)
	const closeModal = useModalStore(state => state.closeModal)

	const form = useForm<TransactionFormValues>({
		resolver: zodResolver(transactionFormSchema),
		defaultValues: {
			type: 'expense',
			amount: '' as unknown as number,
			date: new Date(),
			description: '',
			account: '',
		},
	})

	function onSubmit(values: TransactionFormValues) {
		addTransaction({
			type: values.type,
			amount: values.amount,
			description: values.description,
			accountId: values.account,
			date: values.date.toISOString(),
		})

		closeModal()
		form.reset()
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid items-start gap-6', className)}>
			<FieldGroup>
				<Controller
					name="type"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="type">Typ transakcji</FieldLabel>
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger id="type" aria-invalid={fieldState.invalid}>
									<SelectValue placeholder="Wybierz typ">
										{field.value ? TRANSACTION_TYPE_LABELS[field.value] : 'Wybierz typ'}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="income">Przychód</SelectItem>
									<SelectItem value="expense">Wydatek</SelectItem>
								</SelectContent>
							</Select>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="amount"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="amount">Kwota</FieldLabel>
							<Input
								{...field}
								id="amount"
								type="number"
								step="10"
								inputMode="decimal"
								placeholder="0.00"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="date"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="date">Data</FieldLabel>
							<Popover>
								<PopoverTrigger
									render={
										<Button
											id="date"
											type="button"
											variant="outline"
											aria-invalid={fieldState.invalid}
											data-empty={!field.value}
											className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
										/>
									}
								>
									<CalendarIcon />
									{field.value ? format(field.value, 'PPP', { locale: pl }) : <span>Wybierz datę</span>}
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar mode="single" selected={field.value} onSelect={field.onChange} />
								</PopoverContent>
							</Popover>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="account"
					control={form.control}
					render={({ field, fieldState }) => {
						const selectedAccount = accounts.find(acc => acc.id === field.value)

						return (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="account">Konto</FieldLabel>
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger id="account" aria-invalid={fieldState.invalid}>
										<SelectValue placeholder="Wybierz konto">
											{selectedAccount ? selectedAccount.name : 'Wybierz konto'}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{accounts.map(account => (
											<SelectItem key={account.id} value={account.id}>
												{account.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)
					}}
				/>

				<Controller
					name="description"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="description">Opis</FieldLabel>
							<Input {...field} id="description" placeholder="np. Zakupy spożywcze" aria-invalid={fieldState.invalid} />
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>

			<Button type="submit">Dodaj transakcję</Button>
		</form>
	)
}
