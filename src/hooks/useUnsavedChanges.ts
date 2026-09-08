import { useCallback, useEffect, useRef } from 'react'
import { useBeforeUnload, useBlocker } from 'react-router-dom'

export function useUnsavedChanges(dirty: boolean) {
	const saved = useRef(false)
	const blocker = useBlocker(() => dirty && !saved.current)
	useBeforeUnload(
		useCallback(
			(event: BeforeUnloadEvent) => {
				if (dirty && !saved.current) {
					event.preventDefault()
					event.returnValue = ''
				}
			},
			[dirty]
		)
	)
	useEffect(() => {
		if (blocker.state === 'blocked') {
			if (window.confirm('Masz niezapisane zmiany lub trwa dodawanie zdjęcia. Opuścić stronę?')) blocker.proceed()
			else blocker.reset()
		}
	}, [blocker])
	return () => {
		saved.current = true
	}
}
