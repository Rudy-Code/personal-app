import { Outlet } from 'react-router-dom'
import Container from '../components/ui/Container'
import { SpectatorDashboard } from './../features/workouts/live-tracking/spectator/components/SpectatorDashboard'

function WorkoutsPage() {
	return (
		<section className='bg-app-bg'>
			<Outlet />
			<Container>
				<SpectatorDashboard />
			</Container>
		</section>
	)
}

export default WorkoutsPage
