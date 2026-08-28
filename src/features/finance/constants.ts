import {
	Banknote,
	Bitcoin,
	Briefcase,
	Building2,
	Car,
	Coins,
	CreditCard,
	Gift,
	GraduationCap,
	HandCoins,
	Home,
	Landmark,
	PiggyBank,
	Smartphone,
	TrendingUp,
	Wallet,
	type LucideIcon,
} from 'lucide-react'

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
	income: 'Przychód',
	expense: 'Wydatek',
	transfer: 'Transfer',
}

export const ACCOUNT_ICONS: { id: string; icon: LucideIcon }[] = [
	{ id: 'landmark', icon: Landmark },
	{ id: 'briefcase', icon: Briefcase },
	{ id: 'wallet', icon: Wallet },
	{ id: 'credit-card', icon: CreditCard },
	{ id: 'coins', icon: Coins },
	{ id: 'piggy-bank', icon: PiggyBank },
	{ id: 'building-2', icon: Building2 },
	{ id: 'banknote', icon: Banknote },
	{ id: 'trending-up', icon: TrendingUp },
	{ id: 'bitcoin', icon: Bitcoin },
	{ id: 'smartphone', icon: Smartphone },
	{ id: 'home', icon: Home },
	{ id: 'car', icon: Car },
	{ id: 'graduation-cap', icon: GraduationCap },
	{ id: 'gift', icon: Gift },
	{ id: 'hand-coins', icon: HandCoins },
]

export function getAccountIcon(id: string): LucideIcon {
	return ACCOUNT_ICONS.find(accountIcon => accountIcon.id === id)?.icon ?? Landmark
}

export const COLORS: { name: string; bg: string; text: string }[] = [
	{ name: 'emerald', bg: 'bg-emerald-600', text: 'text-emerald-600' },
	{ name: 'blue', bg: 'bg-blue-600', text: 'text-blue-600' },
	{ name: 'amber', bg: 'bg-amber-600', text: 'text-amber-600' },
	{ name: 'rose', bg: 'bg-rose-600', text: 'text-rose-600' },
	{ name: 'violet', bg: 'bg-violet-600', text: 'text-violet-600' },
	{ name: 'cyan', bg: 'bg-cyan-600', text: 'text-cyan-600' },
	{ name: 'orange', bg: 'bg-orange-600', text: 'text-orange-600' },
	{ name: 'pink', bg: 'bg-pink-600', text: 'text-pink-600' },
	{ name: 'lime', bg: 'bg-lime-600', text: 'text-lime-600' },
	{ name: 'indigo', bg: 'bg-indigo-600', text: 'text-indigo-600' },
]

export const LIMITS_SETTINGS_LABEL = {
	monthlyExpenseLimit: 'Limit wydatków',
	monthlyIncomeGoal: 'Cel zarobkowy',
}
