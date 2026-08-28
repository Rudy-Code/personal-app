import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import FinancePage from './features/finance/pages/FinancePage'
import WorkoutsPage from './features/lifestyle/pages/WorkoutsPage'

import { SpectatorDashboard } from '@features/workouts/live-tracking/spectator/components/SpectatorDashboard'
import { RunnerDashboard } from '@features/workouts/live-tracking/runner/components/RunnerDashboard'
import { MainLayout } from './layouts/MainLayout'
import { Dashboard } from './features/dashboard/pages/Dashboard'
import { JournalPage } from './features/lifestyle/pages/JournalPage'

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: <Dashboard />,
			},
			{ path: 'lifestyle/workouts', element: <WorkoutsPage /> },
			{ path: 'lifestyle/journal', element: <JournalPage /> },

			{ path: 'finance/overview', element: <FinancePage /> },

			//             Grupa Biznes
			//             { path: 'business/sales', element: <SalesPage /> },
			//             { path: 'business/crm', element: <CrmPage /> },
		],
	},
	{
		path: '/live',
		element: <RunnerDashboard />,
	},
	{
		path: '/spectator',
		element: <SpectatorDashboard />,
	},
])

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
