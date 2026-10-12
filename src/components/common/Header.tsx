import { Calendar, CloudDownload, CloudUpload, Download, LogOut, Search, Upload, User } from 'lucide-react'
import { Button } from '../ui/button'
import { useUIStore } from '@stores/useUIStore'
import { useAuthStore } from '@stores/useAuthStore'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useLocation, useNavigate } from 'react-router-dom'
import { SIDEBAR_NAVIGATION } from '@/config/navigation'
import { applyStorageBackup, exportFullBackup, getStorageBackup, importFullBackup } from '@/lib/backup'
import { dataGet, dataPut } from '@/lib/api'
import { useRef, useState } from 'react'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

export const Header = () => {
	const setCommandOpen = useUIStore(state => state.setCommandOpen)
	const { user, token, logout } = useAuthStore()

	const location = useLocation()
	const navigate = useNavigate()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isSyncing, setIsSyncing] = useState(false)

	const getCurrentPageTitle = () => {
		for (const group of SIDEBAR_NAVIGATION) {
			const foundItem = group.items.find(item => item.path === location.pathname)

			if (foundItem) {
				return foundItem.pageTitle || foundItem.label
			}
		}
		return 'RudyCore Dashboard'
	}

	const pageTitle = getCurrentPageTitle()

	const currentDate = new Intl.DateTimeFormat('pl-PL', {
		dateStyle: 'full',
	}).format(new Date())

	const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (window.confirm('Uwaga! Import nadpisze CAŁE obecne dane w aplikacji. Kontynuować?')) {
			try {
				await importFullBackup(file)
			} catch (err) {
				alert('Coś poszło nie tak. Upewnij się, że to poprawny plik z backupem.')
				console.error(err)
			}
		}

		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const handleSyncToCloud = async () => {
		if (!token) return
		setIsSyncing(true)
		try {
			await dataPut(token, getStorageBackup())
			toast.add({ type: 'success', title: 'Dane zapisane w chmurze' })
		} catch (err) {
			console.error(err)
			toast.add({ type: 'error', title: 'Błąd synchronizacji z chmurą' })
		} finally {
			setIsSyncing(false)
		}
	}

	const handleLoadFromCloud = async () => {
		if (!token) return
		if (!window.confirm('Uwaga! Wczytanie danych z chmury nadpisze CAŁE obecne dane. Kontynuować?')) return
		setIsSyncing(true)
		try {
			const data = await dataGet(token)
			if (!data) {
				toast.add({ type: 'info', title: 'Brak danych w chmurze' })
				return
			}
			applyStorageBackup(data)
			toast.add({ type: 'success', title: 'Dane wczytane z chmury' })
			window.location.reload()
		} catch (err) {
			console.error(err)
			toast.add({ type: 'error', title: 'Błąd wczytywania z chmury' })
		} finally {
			setIsSyncing(false)
		}
	}

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : '?'

	return (
		<header className="bg-foreground text-secondary border-border/20 flex items-center justify-between border-b p-4">
			<div>
				<h1 className="text-lg font-bold text-black">{pageTitle}</h1>
				<p className="mt-0.5 flex items-center gap-1.5 text-xs font-light text-zinc-500">
					<Calendar size={16} /> {currentDate}
				</p>
			</div>
			<div className="divide-muted-foreground/50 flex items-center gap-4 divide-x">
				<Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setCommandOpen(true)}>
					<Search className="size-5" />
				</Button>

				<input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />

				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								size="icon"
								className={cn('rounded-full text-xs font-bold', isSyncing && 'animate-pulse')}
								aria-label="Menu użytkownika"
							>
								{initials}
							</Button>
						}
					/>
					<DropdownMenuContent align="end" className="w-52">
						<DropdownMenuGroup>
							<DropdownMenuLabel className="flex items-center gap-2">
								<User className="size-4 shrink-0" />
								<span className="text-foreground truncate font-medium">{user?.username ?? 'Gość'}</span>
							</DropdownMenuLabel>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							onClick={() => {
								void exportFullBackup().catch(() =>
									toast.add({ type: 'error', title: 'Nie udało się wyeksportować kopii zapasowej.' })
								)
							}}
						>
							<Download />
							Eksportuj (JSON)
						</DropdownMenuItem>

						<DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
							<Upload />
							Importuj kopię
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={() => void handleSyncToCloud()} disabled={isSyncing}>
							<CloudUpload />
							Zapisz w chmurze
						</DropdownMenuItem>

						<DropdownMenuItem onClick={() => void handleLoadFromCloud()} disabled={isSyncing}>
							<CloudDownload />
							Wczytaj z chmury
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem variant="destructive" onClick={handleLogout}>
							<LogOut />
							Wyloguj się
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}
