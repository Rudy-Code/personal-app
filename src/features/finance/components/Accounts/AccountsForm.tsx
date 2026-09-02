'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { AccountPersonalizationFormField } from './AccountPersonalizationFormField'
import { useFinanceStore } from '../../stores/useFinanceStore'
import { type IconName } from 'lucide-react/dynamic'
import { useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/stores/useModalStore'

interface AccountFormProps {
	id?: string | null
	className?: string
}

const formSchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, 'Nazwa konta musi mieć co najmniej 3 znaki.')
		.max(32, 'Nazwa konta musi mieć co najwyżej 32 znaki.'),

	description: z.string().trim().max(100, 'Opis może mieć co najwyżej 100 znaków.').optional().or(z.literal('')),

	balance: z.coerce
		.number({ invalid_type_error: 'Podaj poprawną kwotę.' })
		.min(0, 'Kwota początkowa nie może być ujemna.'),

	icon: z.custom<IconName>(val => typeof val === 'string' && val.length > 0, {
		message: 'Musisz wybrać ikonę konta.',
	}),
	color: z.string().min(1, 'Musisz wybrać kolor konta.'),
})

type FormData = z.infer<typeof formSchema>

export function AccountsForm({ className, id }: AccountFormProps) {
	const closeModal = useModalStore(state => state.closeModal)

	const accounts = useFinanceStore(state => state.accounts)
	const addAccount = useFinanceStore(state => state.addAccount)
	const editAccount = useFinanceStore(state => state.updateAccount)

	const isEditMode = Boolean(id)
	const existingAccount = useMemo(() => (id ? accounts.find(a => a.id === id) : null), [accounts, id])

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: '',
			balance: 0,
			icon: 'landmark',
			color: '',
		},
	})

	useEffect(() => {
		if (existingAccount) {
			form.reset({
				name: existingAccount.name,
				description: existingAccount.description ?? '',
				balance: existingAccount.balance,
				icon: (existingAccount.icon as IconName) ?? 'landmark',
				color: existingAccount.color,
			})
		} else {
			form.reset({
				name: '',
				description: '',
				balance: 0,
				icon: 'landmark',
				color: '',
			})
		}
	}, [existingAccount, form])

	function onSubmit(data: FormData) {
		if (isEditMode && id) {
			editAccount?.(id, {
				...data,
				description: data.description ?? '',
			})
		} else {
			addAccount({
				...data,
				description: data.description ?? '',
			})
		}

		form.reset()
		closeModal()
	}

	return (
		<Card className={cn('w-full sm:max-w-md', className)}>
			<FormProvider {...form}>
				<form id="add-account" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="account-name">Nazwa Konta</FieldLabel>
									<Input
										{...field}
										id="account-name"
										aria-invalid={fieldState.invalid}
										placeholder="Konto główne"
										autoComplete="off"
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							name="description"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="account-description">Opis Konta</FieldLabel>
									<Input
										{...field}
										id="account-description"
										aria-invalid={fieldState.invalid}
										placeholder="MBank, Portfel, Revolut itd."
										autoComplete="off"
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							name="balance"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="account-amount">Kwota Początkowa</FieldLabel>
									<InputGroup>
										<InputGroupInput
											{...field}
											type="number"
											step="0.01"
											id="account-amount"
											aria-invalid={fieldState.invalid}
											disabled={isEditMode}
											placeholder="0.00"
											autoComplete="off"
										/>
										<InputGroupAddon align="inline-end">zł</InputGroupAddon>
									</InputGroup>
									{isEditMode && (
										<p className="text-muted-foreground mt-1 text-[11px]">
											Kwoty początkowej nie można edytować. Dodaj transakcję korygującą, aby zmienić saldo.
										</p>
									)}
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<AccountPersonalizationFormField control={form.control} />
					</FieldGroup>
				</form>
			</FormProvider>

			<div className="mt-8">
				<Field orientation="horizontal">
					<Button type="button" variant="outline" onClick={() => form.reset()}>
						Reset
					</Button>
					<Button type="submit" form="add-account">
						Dodaj
					</Button>
				</Field>
			</div>
		</Card>
	)
}
