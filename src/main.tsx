import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import FinancePage from './pages/FinancePage'
import WorkoutsPage from './pages/WorkoutsPage'
import { SpectatorDashboard } from '@features/workouts/live-tracking/spectator/components/SpectatorDashboard'
import { RunnerDashboard } from '@features/workouts/live-tracking/runner/components/RunnerDashboard'
import { MainLayout } from './layouts/MainLayout'

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
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
	},
])

// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <MainLayout />,
//         children: [
//             { index: true, element: <Dashboard /> },

//             // Grupa Styl Życia
//             { path: 'lifestyle/workouts', element: <WorkoutsPage /> },
//             { path: 'lifestyle/journal', element: <JournalPage /> },

//             // Grupa Finanse
//             { path: 'finance/accounts', element: <FinanceAccountsPage /> },

//             // Grupa Biznes
//             { path: 'business/sales', element: <SalesPage /> },
//             { path: 'business/crm', element: <CrmPage /> },
//         ],
//     },
//     // Trasy poza głównym systemem operacyjnym
//     { path: '/live', element: <RunnerDashboard /> },
//     { path: '/spectator', element: <SpectatorDashboard /> }
// ]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
