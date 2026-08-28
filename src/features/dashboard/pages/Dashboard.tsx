import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress'
import {
	MapPin,
	Wallet,
	TrendingUp,
	Trophy,
	ArrowRight,
	Activity,
	BriefcaseBusiness,
	Goal,
	Flame,
	Road,
	TrendingDown,
} from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { useFinanceSummary } from '@/features/finance/hook/useFinanceSummary'
import { formatCurrency } from '@/utils/formatters'
import { cn } from '@/lib/utils'
import { NavLink } from 'react-router-dom'

export const Dashboard = () => {
	const { totalBalance, balanceGrowthPercent } = useFinanceSummary()

	return (
		<div className="flex flex-col px-4 py-6">
			<div className="grid grid-flow-dense grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<Card isInteractive={true}>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
								<Trophy className="size-4" />
							</span>
							<span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Cel główny</span>
						</div>
						<span className="text-muted-foreground text-xs font-medium">06.09.2026</span>
					</div>

					<div className="mt-4">
						<h3 className="text-foreground text-xl font-bold">Ultramaraton 48km</h3>
						<p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
							<MapPin className="size-3.5" />
							Kraków - Bochnia
						</p>
					</div>

					<div className="mt-6 flex items-baseline gap-2">
						<span className="text-foreground font-mono text-5xl font-black tracking-tighter tabular-nums">13</span>
						<span className="text-muted-foreground text-sm font-medium">dni do startu</span>
					</div>
				</Card>

				<NavLink to="/finance/overview">
					<Card isInteractive={true}>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
									<Wallet className="size-4" />
								</span>
								<span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
									Saldo (Finanse)
								</span>
							</div>
							<TrendingUp className="size-4 text-emerald-500" />
						</div>

						<div className="mt-4">
							<p className="text-foreground font-mono text-3xl font-bold tracking-tight tabular-nums">
								{formatCurrency(totalBalance).slice(0, -3)} <span className="text-muted-foreground text-lg">zł</span>
							</p>
							<p
								className={cn(
									'mt-2 flex items-center gap-1 text-xs',
									balanceGrowthPercent >= 0 ? 'text-green-500' : 'text-rose-500'
								)}
							>
								{balanceGrowthPercent >= 0 ? (
									<TrendingUp size={14} className="text-emerald-500" />
								) : (
									<TrendingDown size={14} className="text-rose-500" />
								)}
								{balanceGrowthPercent.toFixed(1)}% od ost. miesiąca
							</p>
						</div>

						<div className="bg-muted/50 border-border/50 mt-5 flex flex-col items-center justify-between rounded-lg border px-3 py-2.5">
							<span className="text-muted-foreground text-sm">Oczekujące faktury:</span>
							<span className="text-foreground font-mono text-sm font-bold tabular-nums">1 800,00 zł</span>
						</div>
					</Card>
				</NavLink>

				<Card variant="secondary">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500">
								<BriefcaseBusiness className="size-4" />
							</span>
							<span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
								Wykorzystanie NDG <span className="text-primary font-bold">(Q3)</span>
							</span>
						</div>
					</div>

					<div className="mt-4">
						<h3 className="text-secondary text-3xl font-bold">1 8000,00 zł</h3>
						<p className="text-muted-foreground mt-1 text-lg">/ 9544.50zł</p>
					</div>

					<div className="mt-6 flex w-full items-center">
						<Progress value={18} className="flex w-full justify-between">
							<ProgressLabel className="text-primary">Wykorzystano:</ProgressLabel>
							<div className="">
								<ProgressValue className="text-muted" />
								<span className="text-muted ml-1 text-sm">limitu</span>
							</div>
						</Progress>
					</div>
				</Card>

				<Card variant="secondary" className="lg:col-span-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500">
								<Goal size={16} />
							</span>
							<span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Cele dnia</span>
						</div>
					</div>

					<div className="mt-4">
						<ul>
							<FieldSet>
								<FieldGroup className="gap-3">
									<Field orientation="horizontal">
										<Checkbox
											id="finder-pref-9k2-hard-disks-ljj-checkbox"
											name="finder-pref-9k2-hard-disks-ljj-checkbox"
											defaultChecked
										/>
										<FieldLabel htmlFor="finder-pref-9k2-hard-disks-ljj-checkbox" className="font-normal">
											Wystawić fakturę za poprawki UI
										</FieldLabel>
									</Field>
									<Field orientation="horizontal">
										<Checkbox
											id="finder-pref-9k2-external-disks-1yg-checkbox"
											name="finder-pref-9k2-external-disks-1yg-checkbox"
										/>
										<FieldLabel htmlFor="finder-pref-9k2-external-disks-1yg-checkbox" className="font-normal">
											TODO 2
										</FieldLabel>
									</Field>
									<Field orientation="horizontal">
										<Checkbox id="finder-pref-9k2-cds-dvds-fzt-checkbox" name="finder-pref-9k2-cds-dvds-fzt-checkbox" />
										<FieldLabel htmlFor="finder-pref-9k2-cds-dvds-fzt-checkbox" className="font-normal">
											TODO 3
										</FieldLabel>
									</Field>
								</FieldGroup>
							</FieldSet>
						</ul>
					</div>
				</Card>

				<Card isInteractive={true}>
					<div className="flex items-center justify-between">
						<div className="flex w-full items-center justify-between">
							<div className="flex items-center gap-3">
								<span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500">
									<Activity className="size-4" />
								</span>
								<span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
									Trening na dziś
								</span>
							</div>
							<div className="text-foreground flex items-center justify-center gap-0.5 rounded-md bg-orange-500 px-2 py-1 text-sm font-bold">
								<span>4</span>
								<Flame size={16} className="" />
							</div>
						</div>
					</div>

					<div className="mt-4">
						<h3 className="text-foreground title text-xl font-bold">Interwały 5x1km</h3>
						<p className="text-muted-foreground desc mt-1 text-sm">Tempo: 4:15/km, przerwa 2 min</p>
						<p className="text-muted-foreground time mt-1 flex items-center gap-1 text-sm">
							<Road size={15} /> 5 km
						</p>
					</div>

					<div className="mt-6 flex items-center justify-self-end">
						<Button className="w-full">
							Rozpocznij trening
							<ArrowRight className="size-4" />
						</Button>
					</div>
				</Card>
			</div>
		</div>
	)
}
