import { Calendar, Database, Download, Search, Upload } from 'lucide-react'
import { Button } from '../ui/button'
import { useUIStore } from '@stores/useUIStore'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useLocation } from 'react-router-dom'
import { SIDEBAR_NAVIGATION } from '@/config/navigation'

export const Header = () => {
	const setCommandOpen = useUIStore(state => state.setCommandOpen)

	const location = useLocation()

	const getCurrentPageTitle = () => {
		for (const group of SIDEBAR_NAVIGATION) {
			const foundItem = group.items.find(item => item.path === location.pathname)

			if (foundItem) {
				return foundItem.pageTitle || foundItem.label
			}
		}
		return 'RudyCore Dashboard'
	}

	const pageTitle = getCurrentPageTitle()

	const currentDate = new Intl.DateTimeFormat('pl-PL', {
		dateStyle: 'full',
	}).format(new Date())

	return (
		<header className="bg-foreground text-secondary border-border/20 flex items-center justify-between border-b p-4">
			<div className="">
				<h1 className="text-lg font-bold text-black">{pageTitle}</h1>
				<p className="mt-0.5 flex items-center gap-1.5 text-xs font-light text-zinc-500">
					<Calendar size={16} /> {currentDate}
				</p>
			</div>
			<div className="divide-muted-foreground/50 flex items-center gap-4 divide-x">
				<Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setCommandOpen(true)}>
					<Search className="size-5" />
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button variant="outline" className="gap-2">
								<Database className="size-4" />
								Dane
							</Button>
						}
					></DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem className="cursor-pointer gap-2">
							<Download className="size-4" />
							Eksportuj (JSON)
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer gap-2">
							<Upload className="size-4" />
							Importuj kopię
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}
