import { ActivityIcon, SportShoeIcon, Wrench, type LucideIcon } from 'lucide-react'
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
	pageTitle: string
}

export const SIDEBAR_NAVIGATION: NavigationItem[] = [
	{
		title: 'Główne',
		items: [
			{
				label: 'Dashboard',
				icon: House,
				path: '/',
				pageTitle: 'Witaj z powrotem!',
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
				pageTitle: 'Panel Treningowy',
			},
			{
				label: 'Dziennik',
				icon: Book,
				path: '/lifestyle/journal',
				pageTitle: 'Przestrzeń Osobista',
			},
			{
				label: 'Sprzęt / Garaż',
				icon: Wrench,
				path: '/lifestyle/accessories',
				pageTitle: 'Garaż & Sprzęt',
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
				pageTitle: 'Przegląd Finansów',
			},
			{
				label: 'Budżet i Koszty',
				icon: Coins,
				path: '/finance/budget',
				pageTitle: 'Budżet & Subskrypcje',
			},
		],
	},
	{
		title: 'Biznes',
		icon: BriefcaseBusiness,
		items: [
			{
				label: 'Ewidencja sprzedaży',
				icon: FileText,
				path: '/business/sales',
				pageTitle: 'Ewidencja (NDG)',
			},
			{
				label: 'Klienci (CRM)',
				icon: UsersRound,
				path: '/business/customers',
				pageTitle: 'Baza Klientów (CRM)',
			},
		],
	},
	{
		title: 'Trasa Live',
		icon: SportShoeIcon,
		items: [
			{
				label: 'Zobacz bieg',
				icon: ActivityIcon,
				path: '/spectator',
				pageTitle: 'Live',
			},
		],
	},
]
