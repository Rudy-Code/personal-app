'use client'

import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/stores/useModalStore'
import { CategoryColorPickerField } from '@/features/finance/components/Categories/CategoryColorPickerField'
import { useJournalStore } from '../../stores/useLifestyleStore'
import { toast } from '@/components/ui/toast'

const categorySchema = z.object({
	name: z.string().trim().min(3, 'Nazwa musi mieć co najmniej 3 znaki.').max(32, 'Maksymalnie 32 znaki.'),
	color: z.string().min(1, 'Musisz wybrać kolor.'),
})

type FormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
	id?: string | null
	className?: string
}

export function JournalCategoriesForm({ id, className }: CategoryFormProps) {
	const closeModal = useModalStore(state => state.closeModal)

	const { journalCategories, addCategory, updateCategory } = useJournalStore()

	const isEditMode = Boolean(id)
	const existingCategory = useMemo(
		() => (id ? journalCategories.find(c => c.id === id) : null),
		[journalCategories, id]
	)

	const form = useForm<FormData>({
		resolver: zodResolver(categorySchema),
		defaultValues: { name: '', color: '' },
	})

	useEffect(() => {
		if (existingCategory) {
			form.reset({
				name: existingCategory.name,

				color: existingCategory.color,
			})
		} else {
			form.reset({ name: '', color: '' })
		}
	}, [existingCategory, form])

	function onSubmit(data: FormData) {
		if (isEditMode && id) {
			updateCategory(id, data)
			toast.add({
				type: 'success',
				title: 'Kategoria zaktualizowana',
				description: `Kategoria "${data.name}" została zaktualizowana.`,
			})
		} else {
			addCategory(data)
			toast.add({
				type: 'success',
				title: 'Kategoria dodana',
				description: `Kategoria "${data.name}" została dodana.`,
			})
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
									placeholder="np. Praca, Hobby"
									autoComplete="off"
								/>
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
