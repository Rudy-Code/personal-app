import type { User } from '@stores/useAuthStore'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function apiFetch<T>(path: string, options?: RequestInit, token?: string): Promise<T> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	}

	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}

	const response = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers: {
			...headers,
			...(options?.headers as Record<string, string> | undefined),
		},
	})

	if (!response.ok) {
		let message = `HTTP ${response.status}`
		try {
			const body = await response.json()
			if (body?.message) {
				message = body.message
			} else if (body?.error) {
				message = body.error
			}
		} catch {
			// ignore parse error
		}
		throw new Error(message)
	}

	if (response.status === 204 || response.headers.get('content-length') === '0') {
		return undefined as T
	}

	return response.json() as Promise<T>
}

export function authRegister(username: string, password: string): Promise<{ token: string; user: User }> {
	return apiFetch('/api/auth/register', {
		method: 'POST',
		body: JSON.stringify({ username, password }),
	})
}

export function authLogin(username: string, password: string): Promise<{ token: string; user: User }> {
	return apiFetch('/api/auth/login', {
		method: 'POST',
		body: JSON.stringify({ username, password }),
	})
}

export function authMe(token: string): Promise<User> {
	return apiFetch('/api/auth/me', undefined, token)
}

export function dataGet(token: string): Promise<Record<string, unknown> | null> {
	return apiFetch<{ data: Record<string, unknown> | null }>('/api/data', undefined, token).then(r => r.data)
}

export function dataPut(token: string, data: Record<string, unknown>): Promise<void> {
	return apiFetch('/api/data', {
		method: 'PUT',
		body: JSON.stringify({ data }),
	}, token)
}

