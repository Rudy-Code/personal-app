const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app)

// Inicjalizacja WebSocketów
const io = new Server(server, {
	cors: {
		origin: '*', // Na produkcji zmienisz to na domenę, z której hostujesz Reacta (np. "https://rudycode.pl")
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

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
	console.log(`🚀 Rudy Tracker Server działa na porcie ${PORT}`)
})
