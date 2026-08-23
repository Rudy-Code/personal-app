import { NavLink } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { SIDEBAR_NAVIGATION } from '@/config/navigation'
import { cn } from '@/lib/utils'

export const SideBar = () => {
	return (
		<aside className="bg-sidebar border-border fixed top-0 left-0 z-40 flex h-full w-72 flex-col border-r px-4 py-6">
			<div className="top mb-8 px-2">
				<p className="text-lg font-bold">RudyCore</p>
				<p className="text-muted-foreground text-sm">Personal Hub</p>
			</div>

			<div className="flex-1 overflow-y-auto">
				{SIDEBAR_NAVIGATION.map(item => (
					<div key={item.title} className="mb-6">
						<p className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-wider uppercase">
							{item.title}
						</p>
						<ul className="space-y-1">
							{item.items.map(subItem => (
								<li key={subItem.label}>
									<NavLink
										to={subItem.path}
										className={({ isActive }) =>
											cn(
												'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
												isActive
													? 'bg-accent text-accent-foreground'
													: 'hover:bg-accent/60 hover:text-foreground text-zinc-300/85'
											)
										}
									>
										<subItem.icon className="size-4 shrink-0" />
										{subItem.label}
									</NavLink>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div className="border-sidebar-border mt-auto border-t pt-4">
				<Button variant="default" className="w-full">
					<Plus className="mr-2 size-4" />
					Szybka akcja
				</Button>
			</div>
		</aside>
	)
}
