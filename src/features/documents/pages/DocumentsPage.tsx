import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileText, Folder, FolderPlus, Plus, Pencil, Trash, Download } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { MarkdownEditor } from '@/components/markdown/MarkdownEditor'
import { toast } from '@/components/ui/toast'
import { useDocumentsStore, type DocumentPage } from '../stores/useDocumentsStore'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'

function PageEditor({ page }: { page: DocumentPage }) {
	const categories = useDocumentsStore(s => s.categories)
	const folders = useDocumentsStore(s => s.folders)
	const updatePage = useDocumentsStore(s => s.updatePage)
	const [draft, setDraft] = useState(page)
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)
	useUnsavedChanges(Boolean(error) || busy)
	function update(fields: Partial<Pick<DocumentPage, 'title' | 'content' | 'folderId' | 'categoryIds'>>) {
		const next = { ...draft, folderId: page.folderId, categoryIds: page.categoryIds, ...fields }
		setDraft(next)
		try {
			updatePage(page.id, {
				title: next.title,
				content: next.content,
				folderId: next.folderId,
				categoryIds: next.categoryIds,
			})
			setError('')
		} catch {
			setError(
				'Nie udało się zapisać zmian. Zwolnij miejsce w przeglądarce i spróbuj ponownie. Skopiuj treść przed opuszczeniem strony.'
			)
		}
	}
	function download() {
		const url = URL.createObjectURL(new Blob([draft.content], { type: 'text/markdown;charset=utf-8' }))
		const link = document.createElement('a')
		link.href = url
		link.download = `${(draft.title || 'Notatka').replace(/[<>:"/\\|?*]/g, '_')}.md`
		link.click()
		setTimeout(() => URL.revokeObjectURL(url), 1000)
	}
	return (
		<Card className="min-w-0 space-y-4 p-4 sm:p-6">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p role="status" className="text-muted-foreground text-xs">
					{error ? 'Zmiany niezapisane' : 'Zmiany zapisują się automatycznie w tej przeglądarce'}
				</p>
				<Button variant="ghost" size="sm" onClick={download}>
					<Download />
					Pobierz Markdown
				</Button>
			</div>
			<label htmlFor="document-title" className="text-sm font-medium">
				Tytuł strony
			</label>
			<Input
				id="document-title"
				value={draft.title}
				maxLength={200}
				onChange={e => update({ title: e.target.value })}
				className="text-lg font-semibold"
			/>
			<div className="flex items-center gap-3">
				<label htmlFor="document-folder" className="text-sm">
					Folder
				</label>
				<select
					id="document-folder"
					className="bg-background min-w-0 rounded-md border p-2 text-sm"
					value={page.folderId ?? ''}
					onChange={e => update({ folderId: e.target.value || null })}
				>
					<option value="">Bez folderu</option>
					{folders.map(f => (
						<option key={f.id} value={f.id}>
							{f.name}
						</option>
					))}
				</select>
			</div>

			<fieldset className="space-y-2">
				<legend className="text-sm font-medium">Kategorie</legend>
				<div className="flex flex-wrap gap-2">
					{categories.map(category => (
						<label
							key={category.id}
							className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm"
						>
							<Checkbox
								checked={page.categoryIds.includes(category.id)}
								onCheckedChange={checked =>
									update({
										categoryIds: checked
											? [...page.categoryIds, category.id]
											: page.categoryIds.filter(id => id !== category.id),
									})
								}
							/>
							<span className={cn('size-3 rounded-full', category.color)} />
							{category.name}
						</label>
					))}
				</div>
				{categories.length === 0 && (
					<p className="text-muted-foreground text-sm">Dodaj kategorie w ustawieniach dokumentów.</p>
				)}
				<Button variant="link" size="sm" href="/settings/documents">
					Zarządzaj kategoriami
				</Button>
			</fieldset>
			{error && (
				<div role="alert" className="text-destructive text-sm">
					{error}
					<Button variant="outline" onClick={() => update({})}>
						Ponów zapis
					</Button>
				</div>
			)}
			<MarkdownEditor value={draft.content} onChange={content => update({ content })} onBusyChange={setBusy} />
			<p className="text-muted-foreground text-xs">
				Plik .md zawiera odwołania do lokalnych zdjęć. Do przeniesienia zdjęć i dokumentów użyj Dane → Eksportuj (JSON).
			</p>
		</Card>
	)
}

export function DocumentsPage() {
	const store = useDocumentsStore()
	const [params, setParams] = useSearchParams()
	const selected = store.pages.find(p => p.id === params.get('page'))
	const [folder, setFolder] = useState<string | null | 'all'>('all')
	const [query, setQuery] = useState('')
	const [categoryFilter, setCategoryFilter] = useState('all')
	const [folderDialog, setFolderDialog] = useState<{ id?: string; name: string } | null>(null)
	const [deleteId, setDeleteId] = useState<string | null>(null)
	const [error, setError] = useState('')
	function act(action: () => void) {
		try {
			action()
			setError('')
		} catch {
			setError('Nie udało się zapisać danych. Sprawdź dostępną przestrzeń w przeglądarce.')
		}
	}
	const pages = store.pages
		.filter(
			p =>
				(folder === 'all' || p.folderId === folder) &&
				(categoryFilter === 'all' ||
					(categoryFilter === 'none' ? p.categoryIds.length === 0 : p.categoryIds.includes(categoryFilter))) &&
				`${p.title} ${p.content}`.toLocaleLowerCase('pl').includes(query.toLocaleLowerCase('pl'))
		)
		.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
	return (
		<div className="space-y-4">
			<Card className="flex flex-wrap items-center justify-between gap-3 p-4 sm:flex-row">
				<div>
					<h2 className="text-lg font-bold">Dokumenty</h2>
					<p className="text-muted-foreground text-sm">Twoje notatki, pomysły i pliki firmy w jednym miejscu.</p>
				</div>
				<Button onClick={() => act(() => setParams({ page: store.addPage(folder === 'all' ? null : folder) }))}>
					<Plus />
					Nowa strona
				</Button>
			</Card>
			{error && (
				<p role="alert" className="text-destructive text-sm">
					{error}
				</p>
			)}
			<div className="grid items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
				<Card className="space-y-3 p-3">
					<Input
						aria-label="Szukaj dokumentów"
						placeholder="Szukaj w tytułach i treści…"
						value={query}
						onChange={e => setQuery(e.target.value)}
					/>
					<label htmlFor="document-category-filter" className="text-sm font-medium">
						Kategoria
					</label>
					<select
						id="document-category-filter"
						className="bg-background w-full rounded-md border p-2 text-sm"
						value={categoryFilter}
						onChange={e => setCategoryFilter(e.target.value)}
					>
						<option value="all">Wszystkie kategorie</option>
						<option value="none">Bez kategorii</option>
						{store.categories.map(c => (
							<option key={c.id} value={c.id}>
								{c.name}
							</option>
						))}
					</select>
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground text-xs font-semibold uppercase">Foldery</span>
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Dodaj folder"
							onClick={() => setFolderDialog({ name: '' })}
						>
							<FolderPlus />
						</Button>
					</div>
					{[{ id: 'all', name: 'Wszystkie strony' }, { id: null, name: 'Bez folderu' }, ...store.folders].map(f => (
						<div key={f.id ?? 'none'} className="flex items-center gap-1">
							<Button
								variant={folder === f.id ? 'secondary' : 'ghost'}
								className="min-w-0 flex-1 justify-start"
								onClick={() => setFolder(f.id)}
							>
								<Folder />
								<span className="truncate">{f.name}</span>
							</Button>
							{f.id && f.id !== 'all' && (
								<>
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label={`Zmień nazwę folderu ${f.name}`}
										onClick={() => setFolderDialog({ id: f.id!, name: f.name })}
									>
										<Pencil />
									</Button>
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label={`Usuń folder ${f.name}`}
										onClick={() =>
											act(() => {
												store.deleteFolder(f.id!)
												setFolder('all')
												toast.add({ type: 'success', title: 'Usunięto folder. Strony przeniesiono do „Bez folderu”.' })
											})
										}
									>
										<Trash />
									</Button>
								</>
							)}
						</div>
					))}
					<div className="text-muted-foreground border-t pt-3 text-xs font-semibold uppercase">
						Strony ({pages.length})
					</div>
					<div className="max-h-96 space-y-1 overflow-y-auto">
						{pages.map(p => (
							<div key={p.id} className="flex items-center gap-1">
								<Button
									variant={selected?.id === p.id ? 'secondary' : 'ghost'}
									className="min-w-0 flex-1 justify-start"
									onClick={() => setParams({ page: p.id })}
								>
									<FileText />
									<span className="truncate">{p.title || 'Bez tytułu'}</span>
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label={`Usuń stronę ${p.title}`}
									onClick={() => setDeleteId(p.id)}
								>
									<Trash />
								</Button>
							</div>
						))}
						{pages.length === 0 && (
							<p className="text-muted-foreground p-3 text-sm">Brak stron. Dodaj nową stronę lub zmień wyszukiwanie.</p>
						)}
					</div>
				</Card>
				{selected ? (
					<PageEditor key={selected.id} page={selected} />
				) : (
					<Card className="flex min-h-80 flex-col items-center justify-center gap-3 p-8 text-center">
						<FileText className="text-muted-foreground size-10" />
						<h3 className="font-semibold">
							{params.has('page') ? 'Nie znaleziono strony' : 'Przestrzeń na Twoje notatki'}
						</h3>
						<p className="text-muted-foreground max-w-sm text-sm">
							Utwórz folder „Firma”, dodaj strony i zapisuj w nich notatki Markdown. Wybierz stronę z listy, aby ją
							edytować.
						</p>
					</Card>
				)}
			</div>
			<Dialog
				open={folderDialog !== null}
				onOpenChange={open => {
					if (!open) setFolderDialog(null)
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{folderDialog?.id ? 'Zmień nazwę folderu' : 'Nowy folder'}</DialogTitle>
						<DialogDescription>Uporządkuj strony, np. w folderze „Firma”.</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={e => {
							e.preventDefault()
							if (!folderDialog?.name.trim()) return
							act(() => {
								if (folderDialog.id) store.renameFolder(folderDialog.id, folderDialog.name)
								else setFolder(store.addFolder(folderDialog.name))
								setFolderDialog(null)
							})
						}}
						className="space-y-3"
					>
						<label htmlFor="folder-name">Nazwa folderu</label>
						<Input
							autoFocus
							id="folder-name"
							required
							maxLength={100}
							value={folderDialog?.name ?? ''}
							onChange={e => setFolderDialog(current => (current ? { ...current, name: e.target.value } : null))}
						/>
						<Button type="submit" disabled={!folderDialog?.name.trim()}>
							Zapisz folder
						</Button>
						{error && (
							<p role="alert" className="text-destructive">
								{error}
							</p>
						)}
					</form>
				</DialogContent>
			</Dialog>
			<Dialog
				open={deleteId !== null}
				onOpenChange={open => {
					if (!open) setDeleteId(null)
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Usunąć stronę?</DialogTitle>
						<DialogDescription>
							Strona „{store.pages.find(p => p.id === deleteId)?.title || 'Bez tytułu'}” zostanie usunięta.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setDeleteId(null)}>
							Anuluj
						</Button>
						<Button
							variant="destructive"
							onClick={() =>
								act(() => {
									if (deleteId) store.deletePage(deleteId)
									if (selected?.id === deleteId) setParams({})
									setDeleteId(null)
								})
							}
						>
							Usuń stronę
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
