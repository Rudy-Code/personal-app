'use client'

import * as React from 'react'
import { Controller, type Control } from 'react-hook-form'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { COLORS } from '../../constants'

export function CategoryColorPickerField({ control }: { control: Control<any> }) {
	const [open, setOpen] = React.useState(false)

	return (
		<Controller
			name="color"
			control={control}
			render={({ field, fieldState }) => {
				const selectedColor = COLORS.find(c => c.bg === field.value)

				return (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel>Kolor kategorii</FieldLabel>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger
								render={
									<button
										type="button"
										className={cn(
											'mt-1.5 flex w-full max-w-xs items-center justify-between rounded-lg border p-2 transition-colors',
											fieldState.invalid ? 'border-destructive' : 'border-border hover:bg-muted/50'
										)}
									/>
								}
							>
								<div className="flex items-center gap-3">
									<div
										className={cn(
											'size-6 rounded-full transition-colors',
											field.value ? field.value : 'border-muted-foreground/40 bg-muted border border-dashed'
										)}
									/>
									<span className="text-sm font-medium">{selectedColor ? selectedColor.name : 'Wybierz kolor'}</span>
								</div>
								<ChevronDownIcon className="text-muted-foreground mr-1 size-4" />
							</PopoverTrigger>

							<PopoverContent className="w-64 p-4" align="start">
								<p className="text-muted-foreground mb-3 text-xs font-medium">Dostępne kolory</p>
								<div className="grid grid-cols-5 gap-3">
									{COLORS.map(({ name, bg }) => {
										const isSelected = field.value === bg

										return (
											<button
												key={name}
												type="button"
												onClick={() => field.onChange(bg)}
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
							</PopoverContent>
						</Popover>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)
			}}
		/>
	)
}
