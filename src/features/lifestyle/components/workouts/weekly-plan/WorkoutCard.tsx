import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { COLORS } from '@/constants/colors'
import type { PlannedWorkout } from '@/features/lifestyle/types'
import { cn } from '@/lib/utils'
import { Timer, Activity, MoreHorizontal, Edit, Trash } from 'lucide-react'

export const WorkoutCard = ({ workout }: { workout: PlannedWorkout }) => {
	const color = COLORS.find(color => color.bg === workout.color)

	return (
		<div className="bg-secondary/40 group relative overflow-hidden rounded-lg p-4 pl-5">
			<span aria-hidden="true" className={cn('absolute inset-y-0 left-0 w-1', color?.bg)} />
			<div className="flex justify-between">
				<p className="text-secondary-foreground/60 font-mono text-sm tabular-nums">{workout.time}</p>
				<div className="">
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="icon-sm"
									className="group-hover:bg-secondary! group-hover:text-muted-foreground"
								/>
							}
						>
							<span className="sr-only">Otwórz menu akcji</span>
							<MoreHorizontal className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuGroup>
								<DropdownMenuLabel>Akcje</DropdownMenuLabel>

								<DropdownMenuItem onClick={() => {}}>
									<Edit size={14} />
									Edytuj
								</DropdownMenuItem>
								<DropdownMenuItem variant="destructive" onClick={() => {}}>
									<Trash size={14} />
									Usuń
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuLabel>Kopiuj</DropdownMenuLabel>
								<DropdownMenuItem
									onClick={() =>
										navigator.clipboard.writeText(
											`${workout.name} - ${workout.time} (${workout.duration} min) ${workout.notes ? `\n\nNotatki: ${workout.notes}` : ''}`
										)
									}
								>
									Info o treningu
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<h4 className="text-secondary-foreground mt-2 font-semibold wrap-break-word">{workout.name}</h4>
			<div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
				<span
					className={cn('inline-flex items-center gap-1.5 rounded-sm border border-current px-2 py-0.5', color?.text)}
				>
					<Activity size={12} aria-hidden="true" />
					{workout.activityLabel}
				</span>
				<span className="text-muted-foreground inline-flex items-center gap-1.5">
					<Timer size={13} aria-hidden="true" />
					{workout.duration} min
				</span>
			</div>
			{workout.notes && (
				<p className="text-muted-foreground border-border mt-4 border-t pt-3 text-xs leading-relaxed wrap-break-word">
					{workout.notes}
				</p>
			)}
		</div>
	)
}
