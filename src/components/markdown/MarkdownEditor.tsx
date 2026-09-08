import { useEffect, useId, useRef, useState } from 'react'
import { Bold, Italic, ImagePlus, List, Heading2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { saveLocalImage } from '@/lib/localImages'
import { MarkdownContent } from './MarkdownContent'
import { TEXT_COLORS } from './markdown'

export function MarkdownEditor({
	value,
	onChange,
	onBlur,
	onBusyChange,
	invalid = false,
}: {
	value: string
	onChange: (value: string) => void
	onBlur?: () => void
	onBusyChange?: (busy: boolean) => void
	invalid?: boolean
}) {
	const id = useId()
	const textarea = useRef<HTMLTextAreaElement>(null)
	const fileInput = useRef<HTMLInputElement>(null)
	const latestValue = useRef(value)
	const latestChange = useRef(onChange)
	const mounted = useRef(true)
	useEffect(() => {
		latestValue.current = value
		latestChange.current = onChange
	}, [value, onChange])
	useEffect(() => {
		mounted.current = true
		return () => {
			mounted.current = false
		}
	}, [])
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')
	const [tab, setTab] = useState<string | null>('edit')
	function change(text: string) {
		latestValue.current = text
		latestChange.current(text)
	}
	function insert(before: string, after = '', placeholder = 'tekst') {
		const start = textarea.current?.selectionStart ?? value.length
		const end = textarea.current?.selectionEnd ?? start
		const selected = value.slice(start, end) || placeholder
		change(value.slice(0, start) + before + selected + after + value.slice(end))
		requestAnimationFrame(() => {
			textarea.current?.focus()
			textarea.current?.setSelectionRange(start + before.length, start + before.length + selected.length)
		})
	}
	async function addImage(file: File) {
		setBusy(true)
		onBusyChange?.(true)
		setError('')
		latestValue.current = value
		try {
			const image = await saveLocalImage(file)
			if (!mounted.current) return
			const alt = file.name.replace(/[[\]\\\r\n]/g, '')
			change(`${latestValue.current}\n\n![${alt}](local-image:${image.id})\n`)
		} catch (cause) {
			if (mounted.current)
				setError(cause instanceof Error ? cause.message : 'Brak miejsca lub dostępu do lokalnej bazy zdjęć.')
		} finally {
			if (mounted.current) {
				setBusy(false)
				onBusyChange?.(false)
				if (fileInput.current) fileInput.current.value = ''
			}
		}
	}
	return (
		<Tabs value={tab} onValueChange={setTab} className="w-full space-y-3">
			<TabsList>
				<TabsTrigger value="edit">Edycja</TabsTrigger>
				<TabsTrigger value="preview">Podgląd</TabsTrigger>
			</TabsList>
			<TabsContent value="edit" className="space-y-3">
				<div
					className="bg-muted/30 flex flex-wrap items-center gap-1 rounded-md border p-2"
					aria-label="Formatowanie Markdown"
				>
					{[
						{ icon: Bold, label: 'Pogrubienie', before: '**', after: '**' },
						{ icon: Italic, label: 'Kursywa', before: '*', after: '*' },
						{ icon: Heading2, label: 'Nagłówek', before: '\n## ', after: '' },
						{ icon: List, label: 'Lista', before: '\n- ', after: '' },
					].map(item => (
						<Button
							key={item.label}
							type="button"
							variant="ghost"
							size="icon-sm"
							title={item.label}
							aria-label={item.label}
							onClick={() => insert(item.before, item.after)}
						>
							<item.icon />
						</Button>
					))}
					<span className="text-muted-foreground mx-1 text-xs">Kolor:</span>
					{Object.entries(TEXT_COLORS).map(([key, color]) => (
						<Button
							key={key}
							type="button"
							variant="ghost"
							size="icon-sm"
							title={color.label}
							aria-label={`Kolor: ${color.label}`}
							onClick={() => insert('[', `](color:${key})`)}
						>
							<span className="size-4 rounded-full" style={{ backgroundColor: color.hex }} />
						</Button>
					))}
					<Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => fileInput.current?.click()}>
						<ImagePlus />
						{busy ? 'Zapisywanie zdjęcia…' : 'Dodaj zdjęcie'}
					</Button>
					<input
						ref={fileInput}
						type="file"
						className="hidden"
						accept="image/jpeg,image/png,image/webp,image/gif"
						onChange={e => {
							const file = e.target.files?.[0]
							if (file) void addImage(file)
						}}
					/>
				</div>
				<label htmlFor={id} className="text-sm font-medium">
					Treść (Markdown)
				</label>
				<Textarea
					ref={textarea}
					id={id}
					value={value}
					onChange={e => change(e.target.value)}
					onBlur={onBlur}
					aria-invalid={invalid}
					className="min-h-80 font-mono"
					placeholder="# Twoje notatki"
				/>
				<p className="text-muted-foreground text-xs">
					Zaznacz tekst i wybierz kolor. Składnia: [tekst](color:red). Zdjęcia JPG, PNG, WebP i GIF do 8 MB są
					zapisywane tylko w tej przeglądarce. Kopia JSON zawiera też zdjęcia.
				</p>
				{error && (
					<p role="alert" className="text-destructive text-sm">
						{error}
					</p>
				)}
			</TabsContent>
			<TabsContent value="preview" className="min-h-80 rounded-md border p-4">
				<MarkdownContent>{value || 'Brak treści do wyświetlenia.'}</MarkdownContent>
			</TabsContent>
		</Tabs>
	)
}
