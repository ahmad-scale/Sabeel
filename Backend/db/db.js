const mongoose = require('mongoose')

function connectDB() {
    if (!process.env.DB_CONNECT) {
        throw new Error('DB_CONNECT must be set before starting the backend.')
    }

    return mongoose.connect(process.env.DB_CONNECT).then((connection) => {
        console.log('Connected to DB')
        return connection
    })
}

module.exports = connectDB