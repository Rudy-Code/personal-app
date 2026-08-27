import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'

import FinancePage from './features/finance/pages/FinancePage'
import WorkoutsPage from './features/lifestyle/pages/WorkoutsPage'

import { SpectatorDashboard } from '@features/workouts/live-tracking/spectator/components/SpectatorDashboard'
import { RunnerDashboard } from '@features/workouts/live-tracking/runner/components/RunnerDashboard'
import { MainLayout } from './layouts/MainLayout'
import { Dashboard } from './features/dashboard/pages/Dashboard'
import { JournalPage } from './features/lifestyle/pages/JournalPage'
import SettingsLayout from './layouts/SettingsLayout'
import { FinanceSettings } from './features/settings/pages/FinanceSettings'

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
			{
				path: 'settings',
				element: <SettingsLayout />, // Zmieniamy nazwę na Layout (to ten komponent z wąskim, pionowym menu)
				children: [
					// Przekierowanie: klikasz /settings -> lecisz od razu do /settings/general
					{ index: true, element: <Navigate to="finance" replace /> },
					// { path: 'general', element: <GeneralSettings /> },
					{ path: 'finance', element: <FinanceSettings /> },
					// { path: 'business', element: <BusinessSettings /> },
					// { path: 'lifestyle', element: <LifestyleSettings /> },
				],
			},

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
