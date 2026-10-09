const http = require('http')
const app = require('./app')
const connectDB = require('./db/db')
const { Server } = require('socket.io')
const attachSocketHandlers = require('./socket')
const port = process.env.PORT || 3000

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL
            ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
            : '*',
        methods: ['GET', 'POST']
    }
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