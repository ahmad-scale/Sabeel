require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const connectDB = require('./db/db')
const userRoutes = require('./routes/user.routes')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))



connectDB()

app.get('/', (req, res) => {
    res.send('Salam!')
})

app.use('/user', userRoutes)

module.exports = app