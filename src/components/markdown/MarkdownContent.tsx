import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getLocalImage } from '@/lib/localImages'
import { colorClass, markdownUrl } from './markdown'

function LocalImage({ src, alt }: { src?: string; alt?: string }) {
	const [image, setImage] = useState<{ src: string; data?: string }>()
	useEffect(() => {
		let active = true
		if (src?.startsWith('local-image:')) {
			getLocalImage(src.slice(12))
				.then(value => {
					if (active) setImage({ src, data: value?.data })
				})
				.catch(() => {
					if (active) setImage({ src })
				})
		}
		return () => {
			active = false
		}
	}, [src])
	if (!src) return <span className="text-muted-foreground">[Zdjęcie zewnętrzne pominięte — dodaj własny plik]</span>
	if (image?.src !== src) return <span className="text-muted-foreground">Ładowanie zdjęcia…</span>
	if (!image.data) return <span className="text-muted-foreground">[Brak lokalnego zdjęcia: {alt}]</span>
	return (
		<img
			src={image.data}
			alt={alt ?? ''}
			loading="lazy"
			className="max-h-[36rem] max-w-full rounded-lg object-contain"
		/>
	)
}

export function MarkdownContent({ children }: { children: string }) {
	return (
		<div className="prose prose-zinc dark:prose-invert max-w-none break-words [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto">
			<Markdown
				remarkPlugins={[remarkGfm]}
				urlTransform={markdownUrl}
				components={{
					a: ({ href, children }) =>
						colorClass(href ?? '') ? (
							<span className={colorClass(href ?? '')}>{children}</span>
						) : (
							<a href={href} rel="noopener noreferrer">
								{children}
							</a>
						),
					img: ({ src, alt }) => <LocalImage key={src} src={src} alt={alt} />,
				}}
			>
				{children}
			</Markdown>
		</div>
	)
}
