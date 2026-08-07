import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import App from './App'
import FinancePage from './pages/FinancePage'
import WorkoutsPage from './pages/WorkoutsPage'

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
])

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
