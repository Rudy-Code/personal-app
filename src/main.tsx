import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'

import { MainLayout } from './layouts/MainLayout'

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{
				index: true,
				lazy: () => import('./features/dashboard/pages/Dashboard').then(m => ({ Component: m.Dashboard })),
			},
			{
				path: 'lifestyle/workouts',
				lazy: () => import('./features/lifestyle/pages/WorkoutsPage').then(m => ({ Component: m.default })),
			},
			{
				path: 'lifestyle/journal',
				lazy: () => import('./features/lifestyle/pages/JournalPage').then(m => ({ Component: m.JournalPage })),
			},
			{
				path: 'lifestyle/journal/edit/:id',
				lazy: () =>
					import('./features/lifestyle/pages/JournalEntryDetails').then(m => ({
						Component: m.JournalEntryDetails,
					})),
			},
			{
				path: 'lifestyle/journal/:id',
				lazy: () =>
					import('./features/lifestyle/pages/JournalDetails').then(m => ({
						Component: m.JournalDetails,
					})),
			},
			{
				path: 'lifestyle/journal/new',
				lazy: () =>
					import('./features/lifestyle/pages/JournalEntryDetails').then(m => ({
						Component: m.JournalEntryDetails,
					})),
			},
			{
				path: 'finance/overview',
				lazy: () => import('./features/finance/pages/FinancePage').then(m => ({ Component: m.default })),
			},
			{
				path: 'settings',
				lazy: () => import('./layouts/SettingsLayout').then(m => ({ Component: m.default })),
				children: [
					{ index: true, element: <Navigate to="finance" replace /> },
					{
						path: 'finance',
						lazy: () =>
							import('./features/settings/pages/FinanceSettings').then(m => ({
								Component: m.FinanceSettings,
							})),
					},
					{
						path: 'lifestyle',
						lazy: () =>
							import('./features/settings/pages/LifestyleSettings').then(m => ({
								Component: m.LifestyleSettings,
							})),
					},
				],
			},
		],
	},
	{
		path: '/live',
		lazy: () =>
			import('@features/workouts/live-tracking/runner/components/RunnerDashboard').then(m => ({
				Component: m.RunnerDashboard,
			})),
	},
	{
		path: '/spectator',
		lazy: () =>
			import('@features/workouts/live-tracking/spectator/components/SpectatorDashboard').then(m => ({
				Component: m.SpectatorDashboard,
			})),
	},
])

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
