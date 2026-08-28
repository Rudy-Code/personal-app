import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as z from 'zod'
import { useEffect } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useModalStore } from '@/stores/useModalStore'
import { useFinanceStore } from '../../stores/useFinanceStore'
import { useAccounts } from '../../hook/useAccounts'
import { TRANSACTION_TYPE_LABELS } from '../../constants'

const transactionFormSchema = z
	.object({
		type: z.enum(['income', 'expense', 'transfer'], {
			required_error: 'Wybierz typ transakcji.',
		}),
		amount: z.coerce
			.number({ invalid_type_error: 'Podaj poprawną kwotę.' })
			.positive('Kwota musi być większa od zera.'),
		date: z.date({ required_error: 'Wybierz datę.' }),
		account: z.string().min(1, 'Wybierz konto źródłowe.'),
		toAccount: z.string().optional(),
		categoryId: z.string().optional(),
		description: z
			.string()
			.min(3, 'Opis musi mieć co najmniej 3 znaki.')
			.max(120, 'Opis może mieć maksymalnie 120 znaków.'),
	})
	.superRefine((data, ctx) => {
		if (data.type === 'transfer') {
			if (!data.toAccount) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Wybierz konto docelowe.', path: ['toAccount'] })
			} else if (data.account === data.toAccount) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Konto docelowe musi być inne.', path: ['toAccount'] })
			}
		} else {
			if (!data.categoryId) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Wybierz kategorię.', path: ['categoryId'] })
			}
		}
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
	const categories = useFinanceStore(state => state.categories)
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
			toAccount: '',
			categoryId: '',
		},
	})

	const [selectedType, selectedAccount, selectedToAccount] = useWatch({
		control: form.control,
		name: ['type', 'account', 'toAccount'],
	})

	const filteredCategories = categories.filter(c => c.type === selectedType)

	// AUTO-OPIS DLA TRANSFERÓW
	useEffect(() => {
		if (selectedType === 'transfer') {
			const fromName = accounts.find(a => a.id === selectedAccount)?.name
			const toName = accounts.find(a => a.id === selectedToAccount)?.name

			let autoDesc = 'Transfer'
			if (fromName) autoDesc += ` z ${fromName}`
			if (toName) autoDesc += ` na ${toName}`

			form.setValue('description', autoDesc, { shouldValidate: true })
		}
	}, [selectedType, selectedAccount, selectedToAccount, accounts, form])

	function onSubmit(values: TransactionFormValues) {
		// czy sa srodki na koncie
		if (values.type === 'transfer' || values.type === 'expense') {
			const sourceAccount = accounts.find(a => a.id === values.account)

			if (sourceAccount && sourceAccount.currentBalance < values.amount) {
				form.setError('amount', {
					type: 'manual',
					message: `Brak środków. Na koncie masz ${sourceAccount.currentBalance.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł.`,
				})
				return
			}
		}

		addTransaction({
			type: values.type,
			amount: values.amount,
			description: values.description,
			accountId: values.account,
			toAccountId: values.type === 'transfer' ? values.toAccount : undefined,
			categoryId: values.type !== 'transfer' ? values.categoryId : undefined,
			date: values.date.toISOString(),
		})

		onSuccess?.(values)
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
							<Select
								value={field.value}
								onValueChange={val => {
									field.onChange(val)

									if (val !== 'transfer') {
										form.setValue('toAccount', '')
									} else {
										form.setValue('categoryId', '')
									}
								}}
							>
								<SelectTrigger id="type" aria-invalid={fieldState.invalid}>
									<SelectValue placeholder="Wybierz typ">
										{field.value ? TRANSACTION_TYPE_LABELS[field.value] : 'Wybierz typ'}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="income">Przychód</SelectItem>
									<SelectItem value="expense">Wydatek</SelectItem>
									<SelectItem value="transfer">Transfer</SelectItem>
								</SelectContent>
							</Select>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				{/* --- KWOTA --- */}
				<Controller
					name="amount"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="amount">Kwota</FieldLabel>
							<Input
								{...field}
								value={field.value ?? ''}
								id="amount"
								type="number"
								step="0.01"
								inputMode="decimal"
								placeholder="0.00"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				{/* --- DATA --- */}
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
									<CalendarIcon className="mr-2 h-4 w-4" />
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

				{/* --- KONTO ŹRÓDŁOWE --- */}
				<Controller
					name="account"
					control={form.control}
					render={({ field, fieldState }) => {
						const selectedAccount = accounts.find(acc => acc.id === field.value)
						return (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="account">{selectedType === 'transfer' ? 'Z konta' : 'Konto'}</FieldLabel>
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

				{/* --- KONTO DOCELOWE (Tylko dla Transferu) --- */}
				{selectedType === 'transfer' && (
					<Controller
						name="toAccount"
						control={form.control}
						render={({ field, fieldState }) => {
							const selectedToAccount = accounts.find(acc => acc.id === field.value)
							return (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="toAccount">Na konto</FieldLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger id="toAccount" aria-invalid={fieldState.invalid}>
											<SelectValue placeholder="Wybierz konto docelowe">
												{selectedToAccount ? selectedToAccount.name : 'Wybierz konto'}
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
				)}

				{/* --- KATEGORIA (Tylko dla Przychodu/Wydatku) --- */}
				{selectedType !== 'transfer' && (
					<Controller
						name="categoryId"
						control={form.control}
						render={({ field, fieldState }) => {
							const selectedCategory = filteredCategories.find(c => c.id === field.value)

							return (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="categoryId">Kategoria</FieldLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger id="categoryId" aria-invalid={fieldState.invalid}>
											<SelectValue placeholder="Wybierz kategorię">
												{selectedCategory ? selectedCategory.name : 'Wybierz kategorię'}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{filteredCategories.map(cat => (
												<SelectItem key={cat.id} value={cat.id}>
													<div className="flex items-center gap-2">
														<div className={cn('size-3 rounded-full', cat.color)} />
														{cat.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)
						}}
					/>
				)}

				{/* --- OPIS --- */}
				<Controller
					name="description"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="description">Opis</FieldLabel>
							<Input {...field} id="description" placeholder="np. Przelew własny" aria-invalid={fieldState.invalid} />
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>

			<Button type="submit">Dodaj transakcję</Button>
		</form>
	)
}
