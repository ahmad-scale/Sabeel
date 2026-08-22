require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())


app.get('/', (req, res) => {
    res.send('Salam!')
})

module.exports = app