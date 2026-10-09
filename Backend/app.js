require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')


// Routers
const userRoutes = require('./routes/user.routes')
const captainRoutes = require('./routes/captian.routes')
const rideRoutes = require('./routes/ride.routes')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())

app.use('/users', userRoutes)
app.use('/captains', captainRoutes)
app.use('/rides', rideRoutes)

app.use(express.static('frontend/dist'))

app.get('/', (req, res) => {
    res.send('Salam!')
})

module.exports = app