import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LogIn, UserPlus, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/Card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast, Toaster } from '@/components/ui/toast'
import { useAuthStore } from '@stores/useAuthStore'
import { authLogin, authRegister, dataGet } from '@/lib/api'
import { applyStorageBackup } from '@/lib/backup'

const loginSchema = z.object({
	username: z.string().min(1, 'Nazwa użytkownika jest wymagana'),
	password: z.string().min(1, 'Hasło jest wymagane'),
})

const registerSchema = z
	.object({
		username: z.string().min(3, 'Min. 3 znaki').max(20, 'Maks. 20 znaków'),
		password: z.string().min(6, 'Min. 6 znaków'),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Hasła muszą być identyczne',
		path: ['confirmPassword'],
	})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

function LoginForm() {
	const navigate = useNavigate()
	const login = useAuthStore(state => state.login)

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

	const onSubmit = async (data: LoginFormData) => {
		try {
			const result = await authLogin(data.username, data.password)
			try {
				const cloudData = await dataGet(result.token)
				if (cloudData) {
					applyStorageBackup(cloudData)
				}
			} catch (syncErr) {
				console.warn('Nie udało się pobrać danych początkowych z chmury:', syncErr)
			}
			login(result.user, result.token)
			toast.add({ type: 'success', title: `Witaj z powrotem, ${result.user.username}!` })
			navigate('/', { replace: true })
		} catch (err) {
			toast.add({ type: 'error', title: err instanceof Error ? err.message : 'Błąd logowania' })
		}
	}

	const handleFillDemo = () => {
		setValue('username', 'demo', { shouldValidate: true })
		setValue('password', 'demo123', { shouldValidate: true })
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<FieldGroup className="gap-4">
				<Field data-invalid={!!errors.username}>
					<FieldLabel htmlFor="login-username">Nazwa użytkownika</FieldLabel>
					<Input
						id="login-username"
						autoComplete="username"
						placeholder="Wprowadź nazwę"
						{...register('username')}
						aria-invalid={!!errors.username}
					/>
					<FieldError errors={errors.username ? [errors.username] : []} />
				</Field>

				<Field data-invalid={!!errors.password}>
					<FieldLabel htmlFor="login-password">Hasło</FieldLabel>
					<Input
						id="login-password"
						type="password"
						autoComplete="current-password"
						placeholder="••••••••"
						{...register('password')}
						aria-invalid={!!errors.password}
					/>
					<FieldError errors={errors.password ? [errors.password] : []} />
				</Field>

				<Button type="submit" className="w-full" disabled={isSubmitting}>
					<LogIn />
					{isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
				</Button>

				<div className="border-border/60 bg-muted/30 flex items-center justify-between rounded-lg border px-3 py-2 text-xs">
					<div className="text-muted-foreground">
						Konto demo: <strong className="text-foreground">demo</strong> / <strong className="text-foreground">demo123</strong>
					</div>
					<Button type="button" variant="outline" size="xs" onClick={handleFillDemo}>
						Wypełnij
					</Button>
				</div>
			</FieldGroup>
		</form>
	)
}

function RegisterForm({ onSuccess }: { onSuccess: (username: string) => void }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

	const onSubmit = async (data: RegisterFormData) => {
		try {
			await authRegister(data.username, data.password)
			reset()
			onSuccess(data.username)
		} catch (err) {
			toast.add({ type: 'error', title: err instanceof Error ? err.message : 'Błąd rejestracji' })
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<FieldGroup className="gap-4">
				<Field data-invalid={!!errors.username}>
					<FieldLabel htmlFor="reg-username">Nazwa użytkownika</FieldLabel>
					<Input
						id="reg-username"
						autoComplete="username"
						placeholder="3–20 znaków"
						{...register('username')}
						aria-invalid={!!errors.username}
					/>
					<FieldError errors={errors.username ? [errors.username] : []} />
				</Field>

				<Field data-invalid={!!errors.password}>
					<FieldLabel htmlFor="reg-password">Hasło</FieldLabel>
					<Input
						id="reg-password"
						type="password"
						autoComplete="new-password"
						placeholder="Min. 6 znaków"
						{...register('password')}
						aria-invalid={!!errors.password}
					/>
					<FieldError errors={errors.password ? [errors.password] : []} />
				</Field>

				<Field data-invalid={!!errors.confirmPassword}>
					<FieldLabel htmlFor="reg-confirm">Powtórz hasło</FieldLabel>
					<Input
						id="reg-confirm"
						type="password"
						autoComplete="new-password"
						placeholder="Powtórz hasło"
						{...register('confirmPassword')}
						aria-invalid={!!errors.confirmPassword}
					/>
					<FieldError errors={errors.confirmPassword ? [errors.confirmPassword] : []} />
				</Field>

				<Button type="submit" className="w-full" disabled={isSubmitting}>
					<UserPlus />
					{isSubmitting ? 'Tworzenie konta...' : 'Zarejestruj się'}
				</Button>
			</FieldGroup>
		</form>
	)
}

export const AuthPage = () => {
	const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
	const [registeredUsername, setRegisteredUsername] = useState<string | null>(null)

	const handleRegisterSuccess = (username: string) => {
		setRegisteredUsername(username)
		setActiveTab('login')
	}

	return (
		<Toaster>
			<div className="bg-background flex min-h-screen items-center justify-center p-4">
				<div className="w-full max-w-sm">
					<div className="mb-8 text-center">
						<div className="bg-primary text-primary-foreground mx-auto mb-4 flex size-12 items-center justify-center rounded-xl text-xl font-black">
							R
						</div>
						<h1 className="text-2xl font-bold tracking-tight">RudyCore</h1>
						<p className="text-muted-foreground mt-1 text-sm">Personal Hub</p>
					</div>

					<Card>
						<Tabs
							value={activeTab}
							onValueChange={val => {
								setActiveTab(val as 'login' | 'register')
								setRegisteredUsername(null)
							}}
							className="gap-5"
						>
							<TabsList className="w-full">
								<TabsTrigger value="login">Logowanie</TabsTrigger>
								<TabsTrigger value="register">Rejestracja</TabsTrigger>
							</TabsList>

							<TabsContent value="login" className="flex flex-col gap-4">
								{registeredUsername !== null && (
									<div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
										<CheckCircle className="mt-0.5 size-4 shrink-0" />
										<div>
											<p className="font-medium">Konto utworzone pomyślnie!</p>
											<p className="text-xs opacity-80">
												Zaloguj się jako <strong>{registeredUsername}</strong>
											</p>
										</div>
									</div>
								)}
								<LoginForm />
							</TabsContent>

							<TabsContent value="register">
								<RegisterForm onSuccess={handleRegisterSuccess} />
							</TabsContent>
						</Tabs>
					</Card>
				</div>
			</div>
		</Toaster>
	)
}
