import { SideBar } from '@/components/ui/SideBar'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
	return (
		<div className="bg-foreground flex min-h-screen">
			<SideBar />
			<main className="flex-1 p-4">
				{/* TODO: header */}
				<Outlet />
			</main>
		</div>
	)
}
