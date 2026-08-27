// components/accounts/account-personalization-form-field.tsx
'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ACCOUNT_ICONS, ACCOUNT_COLORS } from '../../constants'


interface AccountPersonalizationFormFieldProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues>
}

export function AccountPersonalizationFormField<TFieldValues extends FieldValues>({
	control,
}: AccountPersonalizationFormFieldProps<TFieldValues>) {
	const [open, setOpen] = useState(false)

	return (
		<Controller
			name={'icon' as Path<TFieldValues>}
			control={control}
			render={({ field: iconField, fieldState: iconState }) => (
				<Controller
					name={'color' as Path<TFieldValues>}
					control={control}
					render={({ field: colorField, fieldState: colorState }) => {
						const isInvalid = iconState.invalid || colorState.invalid

						const hasSelection = Boolean(iconField.value || colorField.value)

						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Wygląd konta</FieldLabel>
								<Popover open={open} onOpenChange={setOpen}>
									<PopoverTrigger
										render={
											<button
												type="button"
												className={cn(
													'mt-1.5 flex w-full max-w-xs items-center justify-between rounded-lg border p-2 transition-colors',
													isInvalid ? 'border-destructive' : 'border-border hover:bg-muted/50'
												)}
											/>
										}
									>
										<div className="flex items-center gap-3">
											<div
												className={cn(
													'flex size-10 items-center justify-center rounded-full transition-colors',
													colorField.value
														? `${colorField.value} text-white`
														: 'border-muted-foreground/40 bg-muted text-muted-foreground border border-dashed'
												)}
											>
												{iconField.value ? (
													<DynamicIcon name={iconField.value as IconName} className="size-5" />
												) : (
													<span className="text-xs font-semibold">?</span>
												)}
											</div>
											<div className="flex flex-col text-left">
												<span className="text-sm leading-none font-medium">
													{hasSelection ? 'Personalizacja' : 'Wybierz wygląd'}
												</span>
												<span className="text-muted-foreground text-xs">
													{iconField.value && colorField.value ? 'Ikona i kolor wybrane' : 'Kliknij, aby skonfigurować'}
												</span>
											</div>
										</div>
										<ChevronDownIcon className="text-muted-foreground mr-1 size-4" />
									</PopoverTrigger>

									<PopoverContent className="w-80 space-y-4 p-4" align="start">
										<div>
											<p className="text-muted-foreground mb-2 text-xs font-medium">Ikona</p>
											<div className="grid grid-cols-6 gap-1.5">
												{ACCOUNT_ICONS.map(({ id, icon: Icon }) => {
													const isSelected = iconField.value === id

													return (
														<button
															key={id}
															type="button"
															onClick={() => iconField.onChange(id)}
															className={cn(
																'relative flex size-10 items-center justify-center rounded-md border transition-all',
																isSelected
																	? 'border-primary bg-primary text-primary-foreground shadow-sm'
																	: 'text-muted-foreground hover:bg-muted hover:text-foreground border-transparent'
															)}
														>
															<Icon className="size-4" />
														</button>
													)
												})}
											</div>
										</div>

										<div>
											<p className="text-muted-foreground mb-2 text-xs font-medium">Kolor tła</p>
											<div className="grid grid-cols-6 gap-2">
												{ACCOUNT_COLORS.map(({ name, bg }) => {
													const isSelected = colorField.value === bg

													return (
														<button
															key={name}
															type="button"
															onClick={() => colorField.onChange(bg)}
															aria-label={`Kolor ${name}`}
															className={cn(
																'ring-offset-background relative flex size-8 items-center justify-center rounded-full transition-transform hover:scale-105',
																bg,
																isSelected ? 'ring-primary ring-2 ring-offset-2' : 'ring-0'
															)}
														>
															{isSelected && <CheckIcon className="size-4 text-white drop-shadow-sm" />}
														</button>
													)
												})}
											</div>
										</div>
									</PopoverContent>
								</Popover>

								{isInvalid && <FieldError errors={[iconState.error, colorState.error].filter(Boolean)} />}
							</Field>
						)
					}}
				/>
			)}
		/>
	)
}
