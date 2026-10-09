const http = require('http')
const app = require('./app')
const connectDB = require('./db/db')
const { Server } = require('socket.io')
const attachSocketHandlers = require('./socket')
const port = process.env.PORT || 3000

const server = http.createServer(app)

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean)

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error(`Origin ${origin} is not allowed by Socket.IO CORS`))
    },
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000
})

app.set('io', io)
attachSocketHandlers(io)

const startServer = async () => {
  try {
    await connectDB()
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (error) {
    console.error('Unable to start backend because MongoDB connection failed:', error)
    process.exitCode = 1
  }
}

startServer()