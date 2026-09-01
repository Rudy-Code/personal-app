'use client'

import React, { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

import { ArrowLeft, Save, CalendarIcon } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/toast'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from '@/components/ui/combobox'

import { useJournalStore as useLifestyleStore } from '../stores/useLifestyleStore'

const formSchema = z.object({
	title: z.string().trim().min(1, 'Tytuł jest wymagany.'),
	content: z.string().min(1, 'Treść wpisu jest wymagana.'),
	journalCategories: z.array(z.string()).min(1, 'Wybierz co najmniej jedną kategorię.'),
	dateRange: z.object(
		{
			from: z.date({ required_error: 'Data początkowa jest wymagana.' }),
			to: z.date().optional(),
		},
		{ required_error: 'Data jest wymagana.' }
	),
})

type FormData = z.infer<typeof formSchema>

export const JournalEntryDetails = () => {
	const journalCategories = useLifestyleStore(state => state.journalCategories)
	const { id } = useParams()
	const navigate = useNavigate()

	const isEditMode = Boolean(id && id !== 'new')
	const anchor = useComboboxAnchor()

	const entries = useLifestyleStore(state => state.entries)
	const updateEntry = useLifestyleStore(state => state.updateEntry)
	const addEntry = useLifestyleStore(state => state.addEntry)

	const existingEntry = useMemo(() => {
		return isEditMode ? entries.find(e => e.id === id) : null
	}, [entries, id, isEditMode])

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			content: '',
			journalCategories: [],
			dateRange: {
				from: new Date(),
				to: undefined,
			},
		},
	})

	useEffect(() => {
		if (isEditMode && existingEntry) {
			form.reset({
				title: existingEntry.title || '',
				content: existingEntry.content || '',
				journalCategories: existingEntry.tags || [],
				dateRange: {
					from: existingEntry.dateRange?.from ? new Date(existingEntry.dateRange.from) : new Date(),
					to: existingEntry.dateRange?.to ? new Date(existingEntry.dateRange.to) : undefined,
				},
			})
		}
	}, [existingEntry, form, isEditMode])

	if (isEditMode && !existingEntry) {
		return <div className="p-6 text-center text-red-500">Nie znaleziono wpisu.</div>
	}

	function onSubmit(data: FormData) {
		const payload = {
			title: data.title,
			content: data.content,
			tags: data.journalCategories,
			dateRange: {
				from: data.dateRange.from,
				to: data.dateRange.to,
			},
		}

		if (isEditMode && id) {
			updateEntry(id, payload)
			toast.add({ type: 'success', title: 'Pomyślnie zaktualizowano wpis' })
		} else {
			addEntry(payload)
			toast.add({ type: 'success', title: 'Pomyślnie dodano nowy wpis' })
			navigate('/lifestyle/journal/')
		}
	}

	return (
		<FormProvider {...form}>
			<form id="journal-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<Card className="flex flex-col items-center justify-between rounded-xl p-4 sm:flex-row">
					<div className="flex items-center gap-1">
						<Button variant="ghost" type="button" onClick={() => navigate('/lifestyle/journal/')}>
							<ArrowLeft size={12} />
						</Button>
						<h2 className="text-secondary-foreground text-lg font-bold">{isEditMode ? 'Edytuj wpis' : 'Nowy wpis'}</h2>
					</div>
					<div className="mt-2 flex flex-col gap-2 sm:mt-0 sm:flex-row">
						<Button type="submit" form="journal-form">
							<Save className="mr-2 h-4 w-4" />
							{isEditMode ? 'Zapisz zmiany' : 'Dodaj wpis'}
						</Button>
					</div>
				</Card>

				<Card className="hover:border-app-muted group mt-4 flex h-full flex-col gap-4 px-4 py-6 transition-colors">
					<FieldGroup>
						<Controller
							name="title"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="title">Tytuł</FieldLabel>
									<Input
										{...field}
										id="title"
										aria-invalid={fieldState.invalid}
										placeholder="Twój tytuł..."
										autoComplete="off"
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<Controller
								name="dateRange"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Data wpisu</FieldLabel>
										<Popover>
											<PopoverTrigger
												render={
													<Button
														variant="outline"
														className={cn(
															'w-full justify-start text-left font-normal',
															!field.value && 'text-muted-foreground'
														)}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{field.value?.from ? (
															field.value.to ? (
																<>
																	{format(field.value.from, 'LLL dd, y', { locale: pl })} -{' '}
																	{format(field.value.to, 'LLL dd, y', { locale: pl })}
																</>
															) : (
																format(field.value.from, 'LLL dd, y', { locale: pl })
															)
														) : (
															<span>Wybierz zakres dat</span>
														)}
													</Button>
												}
											/>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="range"
													defaultMonth={field.value?.from}
													selected={field.value}
													onSelect={range => {
														if (range?.from) {
															field.onChange({ from: range.from, to: range.to })
														}
													}}
													numberOfMonths={2}
												/>
											</PopoverContent>
										</Popover>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>

							<Controller
								name="journalCategories"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Kategorie</FieldLabel>
										<Combobox
											multiple
											autoHighlight
											items={journalCategories}
											value={field.value}
											onValueChange={field.onChange}
										>
											<ComboboxChips ref={anchor} className="w-full">
												<ComboboxValue>
													{values => (
														<React.Fragment>
															{values.map((categoryId: string) => {
																const category = journalCategories.find(c => c.id === categoryId)
																return <ComboboxChip key={categoryId}>{category?.name || categoryId}</ComboboxChip>
															})}
															<ComboboxChipsInput placeholder="Wybierz kategorię..." />
														</React.Fragment>
													)}
												</ComboboxValue>
											</ComboboxChips>
											<ComboboxContent anchor={anchor}>
												<ComboboxEmpty>Nie znaleziono kategorii.</ComboboxEmpty>
												<ComboboxList>
													{item => (
														<ComboboxItem key={item.id} value={item.id}>
															{item.name}
														</ComboboxItem>
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</div>

						<Controller
							name="content"
							control={form.control}
							render={({ field, fieldState }) => (
								<Tabs defaultValue="overview" className="mt-4 w-full space-y-4">
									<TabsList>
										<TabsTrigger value="overview">Edycja</TabsTrigger>
										<TabsTrigger value="analytics">Podgląd</TabsTrigger>
									</TabsList>
									<TabsContent value="overview">
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="textarea">Treść wpisu (markdown)</FieldLabel>
											<Textarea
												{...field}
												id="textarea"
												aria-invalid={fieldState.invalid}
												placeholder="# Przemyślenia dnia"
												className="min-h-75"
											/>
											{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
										</Field>
									</TabsContent>
									<TabsContent value="analytics" className="w-full">
										<div className="prose prose-zinc prose-invert min-h-75 w-full rounded-md border border-zinc-700 p-4">
											<Markdown remarkPlugins={[remarkGfm]}>{field.value || ''}</Markdown>
										</div>
									</TabsContent>
								</Tabs>
							)}
						/>
					</FieldGroup>
				</Card>
			</form>
		</FormProvider>
	)
}
