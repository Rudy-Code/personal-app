import { Wrench, type LucideIcon } from 'lucide-react'
import {
	House,
	Dumbbell,
	Book,
	Activity,
	Wallet,
	LayoutDashboard,
	Coins,
	BriefcaseBusiness,
	FileText,
	UsersRound,
} from 'lucide-react'

interface NavigationItem {
	title: string
	icon?: LucideIcon
	items: NavigationSubItem[]
}

interface NavigationSubItem {
	label: string
	icon: LucideIcon
	path: string
}

export const SIDEBAR_NAVIGATION: NavigationItem[] = [
	{
		title: 'Główne',
		items: [
			{
				label: 'Dashboard',
				icon: House,
				path: '/',
			},
		],
	},
	{
		title: 'Styl Życia',
		icon: Activity,
		items: [
			{
				label: 'Treningi',
				icon: Dumbbell,
				path: '/lifestyle/workouts',
			},
			{
				label: 'Dziennik',
				icon: Book,
				path: '/lifestyle/journal',
			},
			{
				label: 'Sprzęt / Garaż',
				icon: Wrench,
				path: '/lifestyle/accessories',
			},
		],
	},
	{
		title: 'Finanse',
		icon: Wallet,
		items: [
			{
				label: 'Przegląd Kont',
				icon: LayoutDashboard,
				path: '/finance/overview',
			},
			{
				label: 'Budżet i Koszty',
				icon: Coins,
				path: '/finance/budget',
			},
		],
	},
	{
		title: 'BIZNES',
		icon: BriefcaseBusiness,
		items: [
			{
				label: 'Ewidencja sprzedaży',
				icon: FileText,
				path: '/business/sales',
			},
			{
				label: 'Klienci (CRM)',
				icon: UsersRound,
				path: '/business/customers',
			},
		],
	},
]
