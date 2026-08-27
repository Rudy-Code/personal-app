import { NavLink } from 'react-router-dom'
import { Plus, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { SIDEBAR_NAVIGATION } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/useUIStore'

interface SideBarProps {
	isOpen: boolean
	onClose: () => void
}

export const SideBar = ({ isOpen, onClose }: SideBarProps) => {
	const setCommandOpen = useUIStore(state => state.setCommandOpen)

	return (
		<>
			{isOpen && <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden" onClick={onClose} />}

			<aside
				className={cn(
					'bg-sidebar border-border z-50 flex h-full w-72 shrink-0 flex-col border-r px-4 py-6 transition-transform duration-300',
					'fixed top-0 left-0 -translate-x-full',
					'lg:static lg:translate-x-0',
					isOpen && 'translate-x-0'
				)}
			>
				<div className="top mb-8 flex items-center justify-between px-2">
					<div>
						<p className="text-lg font-bold">RudyCore</p>
						<p className="text-muted-foreground text-sm">Personal Hub</p>
					</div>

					<button onClick={onClose} className="text-muted-foreground lg:hidden">
						<X className="size-5" />
					</button>
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

				<div className="border-sidebar-border mt-auto flex flex-col gap-2 border-t pt-4">
					<Button variant="outline" className="w-full">
						<NavLink to="/settings" className="flex w-full items-center justify-center gap-2">
							<Settings className="mr-2 size-4" />
							Ustawienia
						</NavLink>
					</Button>
					<Button variant="default" className="w-full" onClick={() => setCommandOpen(true)}>
						<Plus className="mr-2 size-4" />
						Szybka akcja
					</Button>
				</div>
			</aside>
		</>
	)
}
