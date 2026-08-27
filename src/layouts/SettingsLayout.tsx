import { NavLink, Outlet } from 'react-router-dom'
import { Wallet, Briefcase, User, Activity } from 'lucide-react'
import { cn } from '@/lib/utils' // Upewnij się, że masz ten import

export default function SettingsLayout() {
	return (
		<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
			{/* ZDEFINIOWANY ASIDE Z TŁEM */}
			<aside className="w-full shrink-0 lg:w-64">
				<nav className="border-border/60 bg-card flex flex-row gap-1 overflow-x-auto rounded-xl border p-2 shadow-xs [-ms-overflow-style:none] lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
					<NavLink
						to="/settings/general"
						className={({ isActive }) =>
							cn(
								'flex shrink-0 items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
								isActive
									? 'bg-primary text-primary-foreground shadow-xs'
									: 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
							)
						}
					>
						<User className="size-4" />
						<span className="whitespace-nowrap">Ogólne</span>
					</NavLink>

					<NavLink
						to="/settings/finance"
						className={({ isActive }) =>
							cn(
								'flex shrink-0 items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
								isActive
									? 'bg-primary text-primary-foreground shadow-xs'
									: 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
							)
						}
					>
						<Wallet className="size-4" />
						<span className="whitespace-nowrap">Finanse</span>
					</NavLink>

					<NavLink
						to="/settings/business"
						className={({ isActive }) =>
							cn(
								'flex shrink-0 items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
								isActive
									? 'bg-primary text-primary-foreground shadow-xs'
									: 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
							)
						}
					>
						<Briefcase className="size-4" />
						<span className="whitespace-nowrap">Biznes</span>
					</NavLink>

					<NavLink
						to="/settings/lifestyle"
						className={({ isActive }) =>
							cn(
								'flex shrink-0 items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
								isActive
									? 'bg-primary text-primary-foreground shadow-xs'
									: 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
							)
						}
					>
						<Activity className="size-4" />
						<span className="whitespace-nowrap">Styl życia</span>
					</NavLink>
				</nav>
			</aside>

			{/* PRAWA STRONA (Formularze) */}
			<main className="min-w-0 flex-1">
				<Outlet />
			</main>
		</div>
	)
}
