import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('flex flex-col rounded-xl border p-5 transition-colors', {
	variants: {
		variant: {
			default: 'bg-card border-border',
			secondary: 'bg-primary-foreground border-app-elevated/20 text-secondary',
			journal: 'bg-yellow-200/10 border-yellow-500/40',
			danger: 'bg-destructive/10 border-destructive/20 text-destructive',
		},
		isInteractive: {
			true: 'hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 cursor-pointer',
			false: '',
		},
	},
	compoundVariants: [
		{
			variant: 'secondary',
			isInteractive: true,
			className: 'hover:bg-secondary hover:text-secondary-foreground hover:border-secondary',
		},
	],
	defaultVariants: {
		variant: 'default',
		isInteractive: false,
	},
})

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
	({ className, variant, isInteractive, children, ...props }, ref) => {
		return (
			<div ref={ref} className={cn(cardVariants({ variant, isInteractive, className }))} {...props}>
				{children}
			</div>
		)
	}
)
Card.displayName = 'Card'
