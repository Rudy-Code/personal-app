import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { CategoryColorPickerField } from '@/features/finance/components/Categories/CategoryColorPickerField'
import {
	documentCategorySchema,
	useDocumentsStore,
	type DocumentCategory,
} from '@/features/documents/stores/useDocumentsStore'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

function CategoryForm({ category, onClose }: { category?: DocumentCategory; onClose: () => void }) {
	const store = useDocumentsStore()
	const form = useForm<Omit<DocumentCategory, 'id'>>({
		resolver: zodResolver(documentCategorySchema),
		defaultValues: category ?? { name: '', color: 'bg-blue-600' },
	})
	function save(values: Omit<DocumentCategory, 'id'>) {
		if (
			store.categories.some(
				c => c.id !== category?.id && c.name.toLocaleLowerCase('pl') === values.name.toLocaleLowerCase('pl')
			)
		) {
			form.setError('name', { message: 'Kategoria o tej nazwie już istnieje.' })
			return
		}
		try {
			if (category) store.updateCategory(category.id, values)
			else store.addCategory(values)
			toast.add({ type: 'success', title: category ? 'Zapisano kategorię' : 'Dodano kategorię' })
			onClose()
		} catch {
			form.setError('root', { message: 'Nie udało się zapisać kategorii. Sprawdź dostępną przestrzeń w przeglądarce.' })
		}
	}
	return (
		<form onSubmit={form.handleSubmit(save)} className="space-y-4">
			<div className="space-y-2">
				<label htmlFor="document-category-name" className="text-sm font-medium">
					Nazwa kategorii
				</label>
				<Input
					id="document-category-name"
					autoFocus
					maxLength={32}
					{...form.register('name')}
					aria-invalid={Boolean(form.formState.errors.name)}
					placeholder="np. Projekty, Klienci, Pomysły"
				/>
				{form.formState.errors.name && (
					<p role="alert" className="text-destructive text-sm">
						{form.formState.errors.name.message}
					</p>
				)}
			</div>
			<CategoryColorPickerField control={form.control} />
			{form.formState.errors.root && (
				<p role="alert" className="text-destructive text-sm">
					{form.formState.errors.root.message}
				</p>
			)}
			<div className="flex justify-end gap-2">
				<Button type="button" variant="outline" onClick={onClose}>
					Anuluj
				</Button>
				<Button type="submit">{category ? 'Zapisz zmiany' : 'Dodaj kategorię'}</Button>
			</div>
		</form>
	)
}

export function DocumentsSettings() {
	const store = useDocumentsStore()
	const [editing, setEditing] = useState<DocumentCategory | 'new' | null>(null)
	const [deleting, setDeleting] = useState<DocumentCategory | null>(null)
	const [error, setError] = useState('')
	return (
		<div className="space-y-6 px-4 py-6">
			<h1 className="text-secondary text-2xl font-bold">Ustawienia Dokumentów</h1>
			<Card className="space-y-4">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h2 className="text-lg font-semibold">Kategorie dokumentów</h2>
					<Button onClick={() => setEditing('new')}>
						<Plus />
						Dodaj kategorię
					</Button>
				</div>
				<p className="text-muted-foreground text-sm">
					Kategorie pomagają porządkować strony niezależnie od folderów. Jedna strona może mieć kilka kategorii.
				</p>
				{store.categories.length === 0 && (
					<p className="text-muted-foreground py-4 text-sm">
						Brak kategorii. Dodaj pierwszą kategorię, aby przypisywać ją do dokumentów.
					</p>
				)}
				{store.categories.map(category => (
					<div key={category.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
						<div className="flex min-w-0 items-center gap-3">
							<span className={cn('size-4 shrink-0 rounded-full', category.color)} />
							<span className="truncate font-medium">{category.name}</span>
							<span className="text-muted-foreground shrink-0 text-xs">
								{store.pages.filter(p => p.categoryIds.includes(category.id)).length} stron
							</span>
						</div>
						<div className="flex gap-1">
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label={`Edytuj kategorię ${category.name}`}
								onClick={() => setEditing(category)}
							>
								<Pencil />
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label={`Usuń kategorię ${category.name}`}
								onClick={() => {
									setError('')
									setDeleting(category)
								}}
							>
								<Trash />
							</Button>
						</div>
					</div>
				))}
				<Button variant="link" href="/documents" className="self-start">
					Przejdź do dokumentów
				</Button>
			</Card>
			<Dialog
				open={editing !== null}
				onOpenChange={open => {
					if (!open) setEditing(null)
				}}
			>
				<DialogContent className="max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{editing === 'new' ? 'Nowa kategoria dokumentów' : 'Edytuj kategorię dokumentów'}</DialogTitle>
						<DialogDescription>Wybierz nazwę i kolor kategorii.</DialogDescription>
					</DialogHeader>
					{editing && (
						<CategoryForm
							key={editing === 'new' ? 'new' : editing.id}
							category={editing === 'new' ? undefined : editing}
							onClose={() => setEditing(null)}
						/>
					)}
				</DialogContent>
			</Dialog>
			<Dialog
				open={deleting !== null}
				onOpenChange={open => {
					if (!open) setDeleting(null)
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Usunąć kategorię „{deleting?.name}”?</DialogTitle>
						<DialogDescription>
							Kategoria zostanie usunięta z przypisanych stron. Dokumenty i ich treść pozostaną zachowane.
						</DialogDescription>
					</DialogHeader>
					{error && (
						<p role="alert" className="text-destructive text-sm">
							{error}
						</p>
					)}
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setDeleting(null)}>
							Anuluj
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								try {
									if (deleting) store.deleteCategory(deleting.id)
									setDeleting(null)
									toast.add({ type: 'success', title: 'Usunięto kategorię' })
								} catch {
									setError('Nie udało się zapisać zmian. Spróbuj ponownie.')
								}
							}}
						>
							Usuń kategorię
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
