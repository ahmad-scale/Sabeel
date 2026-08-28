require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const connectDB = require('./db/db')
const userRoutes = require('./routes/user.routes')
const cookieParser = require('cookie-parser')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())


connectDB()

app.get('/', (req, res) => {
    res.send('Salam!')
})

app.use('/users', userRoutes)

module.exports = app