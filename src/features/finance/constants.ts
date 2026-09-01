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


export const LIMITS_SETTINGS_LABEL = {
	monthlyExpenseLimit: 'Limit wydatków',
	monthlyIncomeGoal: 'Cel zarobkowy',
}
