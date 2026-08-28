require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const connectDB = require('./db/db')
const cookieParser = require('cookie-parser')


// Routers
const userRoutes = require('./routes/user.routes')
const captainRoutes = require('./routes/captian.routes')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())

connectDB()


app.use('/users', userRoutes)
app.use('/captains', captainRoutes)

app.get('/', (req, res) => {
    res.send('Salam!')
})

module.exports = app