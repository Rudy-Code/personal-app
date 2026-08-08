import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import App from './App'
import FinancePage from './pages/FinancePage'
import WorkoutsPage from './pages/WorkoutsPage'
import { SpectatorDashboard } from '@features/workouts/live-tracking/spectator/components/SpectatorDashboard'
import { RunnerDashboard } from '@features/workouts/live-tracking/runner/components/RunnerDashboard'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/finance',
		element: <FinancePage />,
	},
	{
		path: '/workouts',
		element: <WorkoutsPage />,
	},
	{
		path: '/live',
		element: <RunnerDashboard />,
	},
	{
		path: '/spectator',
		element: <SpectatorDashboard />,
	}
])

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
