// src/components/common/CommandPalette.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from '@/components/ui/command'
import { SIDEBAR_NAVIGATION } from '@/config/navigation'
import { Plus, Settings } from 'lucide-react'
import { useUIStore } from '@stores/useUIStore'

export const CommandPalette = () => {
	const navigate = useNavigate()

	const isCommandOpen = useUIStore(state => state.isCommandOpen)
	const setCommandOpen = useUIStore(state => state.setCommandOpen)
	const toggleCommand = useUIStore(state => state.toggleCommand)

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				toggleCommand()
			}
		}
		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [toggleCommand])

	const runCommand = (command: () => void) => {
		setCommandOpen(false)
		command()
	}

	return (
		<CommandDialog open={isCommandOpen} onOpenChange={setCommandOpen}>
			<CommandInput placeholder="Wpisz polecenie lub szukaj..." />
			<CommandList>
				<CommandEmpty>Brak wyników.</CommandEmpty>

				<CommandGroup heading="Szybkie akcje">
					<CommandItem onSelect={() => runCommand(() => console.log('Otwórz modal nowej faktury'))}>
						<Plus className="mr-2 size-4" />
						<span>Nowa faktura (NDG)</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => console.log('Otwórz modal logowania treningu'))}>
						<Plus className="mr-2 size-4" />
						<span>Zaloguj trening</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => console.log('Otwórz modal ustawień aplikacji'))}>
						<Settings className="mr-2 size-4" />
						<span>Ustawienia aplikacji</span>
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading="Nawigacja (RudyCore)">
					{SIDEBAR_NAVIGATION.map(group =>
						group.items.map(item => (
							<CommandItem key={item.path} onSelect={() => runCommand(() => navigate(item.path))}>
								<item.icon className="size-4 shrink-0" />
								<span>{item.label}</span>

								<CommandShortcut className="text-xs tracking-wide">{group.title}</CommandShortcut>
							</CommandItem>
						))
					)}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	)
}
