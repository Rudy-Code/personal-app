import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Header } from '@/components/common/Header'
import { SideBar } from '@/components/common/SideBar'
import { CommandPalette } from '@/components/common/CommandPalette'

export const MainLayout = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	return (
		<div className="bg-background text-foreground flex h-screen w-full overflow-hidden font-sans">
			<SideBar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
			<CommandPalette />

			<main className="bg-foreground/95 flex min-w-0 flex-1 flex-col overflow-y-auto">
				<div className="border-border flex h-16 shrink-0 items-center border-b px-4 lg:hidden">
					<button onClick={() => setIsMobileMenuOpen(true)} className="hover:bg-accent rounded-md p-2">
						<Menu className="size-6" />
					</button>
					<span className="ml-4 font-bold">RudyCore</span>
				</div>

				<Header />

				<div className="flex-1 p-4 lg:p-8">
					<Outlet />
				</div>
			</main>
		</div>
	)
}
