const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// ─── Config ──────────────────────────────────────────────────────────────────

require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const SALT_ROUNDS = 12
const PORT = process.env.PORT || 3001

const ALLOWED_ORIGINS = [
	'http://localhost:5173',
	'https://personal.rudycode.pl',
]

// ─── Data directory helpers ───────────────────────────────────────────────────

const DATA_DIR = path.join(__dirname, 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

function ensureDataDir() {
	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true })
	}
	if (!fs.existsSync(USERS_FILE)) {
		fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf8')
	}
}

function readUsers() {
	ensureDataDir()
	try {
		return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
	} catch {
		return []
	}
}

function writeUsers(users) {
	ensureDataDir()
	fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

function userDataFile(userId) {
	return path.join(DATA_DIR, `user-${userId}.json`)
}

function readUserData(userId) {
	const file = userDataFile(userId)
	if (!fs.existsSync(file)) return null
	try {
		return JSON.parse(fs.readFileSync(file, 'utf8'))
	} catch {
		return null
	}
}

function writeUserData(userId, data) {
	ensureDataDir()
	fs.writeFileSync(userDataFile(userId), JSON.stringify(data, null, 2), 'utf8')
}

function seedDemoAccount() {
	ensureDataDir()
	try {
		const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
		const demoId = 'demo-user-0000-0000-000000000001'
		if (!users.some(u => u.username.toLowerCase() === 'demo')) {
			users.push({
				id: demoId,
				username: 'demo',
				passwordHash: bcrypt.hashSync('demo123', SALT_ROUNDS),
				createdAt: new Date().toISOString(),
			})
			writeUsers(users)
		}
		const demoFile = userDataFile(demoId)
		const samplePath = path.join(__dirname, '..', 'public', 'sample-data.json')
		if (!fs.existsSync(demoFile) && fs.existsSync(samplePath)) {
			const sampleData = JSON.parse(fs.readFileSync(samplePath, 'utf8'))
			writeUserData(demoId, sampleData)
		}
	} catch (err) {
		console.warn('[SEED DEMO WARNING]', err.message)
	}
}

seedDemoAccount()

// ─── App setup ───────────────────────────────────────────────────────────────

const app = express()

const corsOptions = {
	origin: (origin, callback) => {
		// Allow requests with no origin (e.g. curl / mobile apps) or matching origins
		if (!origin || ALLOWED_ORIGINS.includes(origin)) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))

// ─── Auth middleware ──────────────────────────────────────────────────────────

function authMiddleware(req, res, next) {
	const authHeader = req.headers['authorization']
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Brak tokenu autoryzacji' })
	}

	const token = authHeader.slice(7)
	try {
		const payload = jwt.verify(token, JWT_SECRET)
		req.userId = payload.userId
		req.username = payload.username
		next()
	} catch {
		return res.status(401).json({ error: 'Nieprawidłowy lub wygasły token' })
	}
}

// ─── Auth routes ─────────────────────────────────────────────────────────────

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
	try {
		const { username, password } = req.body

		if (!username || !password) {
			return res.status(400).json({ error: 'Wymagane pola: username, password' })
		}
		if (username.length < 3) {
			return res.status(400).json({ error: 'Nazwa użytkownika musi mieć co najmniej 3 znaki' })
		}
		if (password.length < 6) {
			return res.status(400).json({ error: 'Hasło musi mieć co najmniej 6 znaków' })
		}

		const users = readUsers()
		const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase())
		if (existing) {
			return res.status(409).json({ error: 'Użytkownik o tej nazwie już istnieje' })
		}

		const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
		const newUser = {
			id: crypto.randomUUID(),
			username,
			passwordHash,
			createdAt: new Date().toISOString(),
		}

		users.push(newUser)
		writeUsers(users)

		const token = jwt.sign(
			{ userId: newUser.id, username: newUser.username },
			JWT_SECRET,
			{ expiresIn: '30d' }
		)

		console.log(`[REGISTER] Nowy użytkownik: ${username}`)
		return res.status(201).json({
			token,
			user: { id: newUser.id, username: newUser.username, createdAt: newUser.createdAt },
		})
	} catch (err) {
		console.error('[REGISTER ERROR]', err)
		return res.status(500).json({ error: 'Błąd serwera' })
	}
})

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
	try {
		const { username, password } = req.body

		if (!username || !password) {
			return res.status(400).json({ error: 'Wymagane pola: username, password' })
		}

		const users = readUsers()
		const user = users.find(u => u.username.toLowerCase() === username.toLowerCase())
		if (!user) {
			return res.status(401).json({ error: 'Nieprawidłowa nazwa użytkownika lub hasło' })
		}

		const match = await bcrypt.compare(password, user.passwordHash)
		if (!match) {
			return res.status(401).json({ error: 'Nieprawidłowa nazwa użytkownika lub hasło' })
		}

		const token = jwt.sign(
			{ userId: user.id, username: user.username },
			JWT_SECRET,
			{ expiresIn: '30d' }
		)

		console.log(`[LOGIN] Zalogowano: ${username}`)
		return res.json({
			token,
			user: { id: user.id, username: user.username, createdAt: user.createdAt },
		})
	} catch (err) {
		console.error('[LOGIN ERROR]', err)
		return res.status(500).json({ error: 'Błąd serwera' })
	}
})

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, (req, res) => {
	try {
		const users = readUsers()
		const user = users.find(u => u.id === req.userId)
		if (!user) {
			return res.status(404).json({ error: 'Użytkownik nie znaleziony' })
		}
		return res.json({
			user: { id: user.id, username: user.username, createdAt: user.createdAt },
		})
	} catch (err) {
		console.error('[ME ERROR]', err)
		return res.status(500).json({ error: 'Błąd serwera' })
	}
})

// ─── Data routes ──────────────────────────────────────────────────────────────

// GET /api/data - get user's saved app backup JSON
app.get('/api/data', authMiddleware, (req, res) => {
	try {
		const data = readUserData(req.userId)
		if (data === null) {
			return res.json({ data: null })
		}
		return res.json({ data })
	} catch (err) {
		console.error('[GET DATA ERROR]', err)
		return res.status(500).json({ error: 'Błąd serwera' })
	}
})

// PUT /api/data - save/replace user's app backup JSON
app.put('/api/data', authMiddleware, (req, res) => {
	try {
		const { data } = req.body
		if (data === undefined) {
			return res.status(400).json({ error: 'Wymagane pole: data' })
		}
		writeUserData(req.userId, data)
		console.log(`[DATA SAVED] Użytkownik: ${req.username}`)
		return res.json({ success: true })
	} catch (err) {
		console.error('[PUT DATA ERROR]', err)
		return res.status(500).json({ error: 'Błąd serwera' })
	}
})

// ─── HTTP server ──────────────────────────────────────────────────────────────

const server = http.createServer(app)

// ─── Socket.io - live running tracking ───────────────────────────────────────

// Zabezpieczamy Socket.io
const io = new Server(server, {
	cors: {
		origin: ALLOWED_ORIGINS,
		methods: ['GET', 'POST'],
	},
})

// Cache najnowszego stanu - dzięki temu nowi kibice nie widzą
// pustego ekranu przez 5 sekund, zanim Twój S25 wyśle kolejną paczkę.
let lastRunnerState = null

io.on('connection', socket => {
	console.log(`[CONNECT] Nowe połączenie: ${socket.id}`)

	// ---> Akcja dla Odbiornika (Kibice)
	socket.on('join_room', roomName => {
		socket.join(roomName)
		console.log(`[ROOM] ${socket.id} dołączył do pokoju: ${roomName}`)

		if (lastRunnerState) {
			socket.emit('runner_update', lastRunnerState)
		}
	})

	// ---> Akcja dla Nadajnika (Twój telefon S25)
	socket.on('send_update', data => {
		lastRunnerState = data

		// Broadcast tylko do konkretnego pokoju (żeby nie wysyłać tego do wszystkich losowych klientów)
		io.to('runner:rudy').emit('runner_update', data)
	})

	socket.on('disconnect', () => {
		console.log(`[DISCONNECT] Rozłączono: ${socket.id}`)
	})
})

// ─── Start ────────────────────────────────────────────────────────────────────

server.listen(PORT, '0.0.0.0', () => {
	console.log(`🚀 Serwer API działa na porcie ${PORT}`)
})
