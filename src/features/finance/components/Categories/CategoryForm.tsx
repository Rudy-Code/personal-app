'use client'

import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/stores/useModalStore'
import { useFinanceStore } from '../../stores/useFinanceStore'
import { CategoryColorPickerField } from './CategoryColorPickerField'
import { TRANSACTION_TYPE_LABELS } from '../../constants'

const categorySchema = z.object({
	name: z.string().trim().min(3, 'Nazwa musi mieć co najmniej 3 znaki.').max(32, 'Maksymalnie 32 znaki.'),
	type: z.enum(['expense', 'income'], {
		required_error: 'Musisz wybrać typ kategorii.',
	}),
	color: z.string().min(1, 'Musisz wybrać kolor.'),
})

type FormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
	id?: string | null
	className?: string
}

export function CategoryForm({ id, className }: CategoryFormProps) {
	const { addCategory, updateCategory, categories } = useFinanceStore()
	const closeModal = useModalStore(state => state.closeModal)

	const isEditMode = Boolean(id)
	const existingCategory = useMemo(() => (id ? categories.find(c => c.id === id) : null), [categories, id])

	const form = useForm<FormData>({
		resolver: zodResolver(categorySchema),
		defaultValues: { name: '', type: 'expense', color: '' },
	})

	useEffect(() => {
		if (existingCategory) {
			form.reset({
				name: existingCategory.name,
				type: existingCategory.type as 'expense' | 'income',
				color: existingCategory.color,
			})
		} else {
			form.reset({ name: '', type: 'expense', color: '' })
		}
	}, [existingCategory, form])

	function onSubmit(data: FormData) {
		if (isEditMode && id) {
			updateCategory(id, data)
		} else {
			addCategory(data)
		}
		form.reset()
		closeModal()
	}

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
				<FieldGroup>
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="category-name">Nazwa Kategorii</FieldLabel>
								<Input
									{...field}
									id="category-name"
									aria-invalid={fieldState.invalid}
									placeholder="np. Jedzenie, Wypłata"
									autoComplete="off"
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="type"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Typ</FieldLabel>
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger aria-invalid={fieldState.invalid}>
										<SelectValue placeholder="Wybierz typ">
											{field.value ? TRANSACTION_TYPE_LABELS[field.value] : 'Wybierz typ'}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="expense">Wydatek</SelectItem>
										<SelectItem value="income">Wpływ</SelectItem>
									</SelectContent>
								</Select>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<CategoryColorPickerField control={form.control} />
				</FieldGroup>

				<div className="flex justify-end gap-3 pt-2">
					<Button type="button" variant="outline" onClick={closeModal}>
						Anuluj
					</Button>
					<Button type="submit">{isEditMode ? 'Zapisz zmiany' : 'Dodaj kategorię'}</Button>
				</div>
			</form>
		</FormProvider>
	)
}
