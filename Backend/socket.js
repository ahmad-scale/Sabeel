const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const captainModel = require('./models/captain.model')
const userModel = require('./models/user.model')
const blackListTokenModel = require('./models/blackListToken.model')
const rideService = require('./services/ride.service')

const attachSocketHandlers = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token
            if (!token) return next(new Error('Authentication required'))

            const [decoded, blacklisted] = await Promise.all([
                Promise.resolve(jwt.verify(token, process.env.JWT_SECRET)),
                blackListTokenModel.exists({ token })
            ])
            if (blacklisted) return next(new Error('Authentication required'))

            const captain = await captainModel.findById(decoded._id).select('_id')
            if (captain) {
                socket.data.userId = captain._id.toString()
                socket.data.role = 'captain'
                return next()
            }

            const user = await userModel.findById(decoded._id).select('_id')
            if (!user) return next(new Error('Authentication required'))
            socket.data.userId = user._id.toString()
            socket.data.role = 'user'
            return next()
        } catch {
            return next(new Error('Authentication required'))
        }
    })

    io.on('connection', (socket) => {
        const captainId = socket.data.role === 'captain' ? socket.data.userId : null
        if (socket.data.role === 'user') socket.join(`user:${socket.data.userId}`)
        const captainReady = captainId
            ? captainModel.findByIdAndUpdate(captainId, {
                socketId: socket.id,
                status: 'active'
            }).then(() => true).catch((error) => {
                console.error('Unable to mark captain as online:', error)
                socket.emit('tracking:error', { message: 'Unable to start captain location sharing.' })
                return false
            })
            : Promise.resolve(false)
        let lastRideOfferCheck = 0

        socket.on('captain:location:update', async (location, acknowledge = () => {}) => {
            if (!captainId) {
                acknowledge({ error: 'Only captains can share a location.' })
                return
            }
            if (!await captainReady) {
                acknowledge({ error: 'Unable to start your live location session.' })
                return
            }
            const { latitude, longitude } = location || {}
            if (
                !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
                !Number.isFinite(longitude) || longitude < -180 || longitude > 180
            ) {
                acknowledge({ error: 'A valid latitude and longitude are required.' })
                return
            }

            try {
                const updatedCaptain = await captainModel.findOneAndUpdate({
                    _id: captainId,
                    socketId: socket.id
                }, {
                    $set: {
                        location: { lat: latitude, lng: longitude },
                        status: 'active'
                    }
                })
                if (!updatedCaptain) {
                    acknowledge({ error: 'Your tracking session is no longer active.' })
                    return
                }
                io.to(`captain:${captainId}`).emit('captain:location', {
                    latitude,
                    longitude,
                    updatedAt: new Date().toISOString()
                })
                if (Date.now() - lastRideOfferCheck >= 15000) {
                    lastRideOfferCheck = Date.now()
                    try {
                        const pendingRides = await rideService.findPendingRidesForCaptain(captainId)
                        for (const ride of pendingRides) {
                            socket.emit('new-ride', {
                                ride,
                                rider: { fullname: ride.user?.fullname }
                            })
                        }
                    } catch (error) {
                        console.error('Unable to deliver pending ride offers:', error)
                    }
                }
                acknowledge({ ok: true })
            } catch (error) {
                console.error('Unable to save captain location:', error)
                acknowledge({ error: 'Unable to save your location right now.' })
            }
        })

        socket.on('captain:watch', async (requestedCaptainId, acknowledge = () => {}) => {
            if (socket.data.role !== 'user') {
                acknowledge({ error: 'Only riders can watch a captain location.' })
                return
            }
            if (!mongoose.isValidObjectId(requestedCaptainId)) {
                acknowledge({ error: 'A valid captain is required for live tracking.' })
                return
            }

            try {
                const captain = await captainModel.findOne({
                    _id: requestedCaptainId,
                    status: 'active'
                }).select('location socketId')
                if (
                    !captain?.socketId ||
                    !Number.isFinite(captain.location?.lat) ||
                    !Number.isFinite(captain.location?.lng)
                ) {
                    acknowledge({ error: 'This captain is not currently sharing a live location.' })
                    return
                }

                const room = `captain:${captain._id}`
                await socket.join(room)
                socket.emit('captain:location', {
                    latitude: captain.location.lat,
                    longitude: captain.location.lng,
                    updatedAt: new Date().toISOString()
                })
                acknowledge({ ok: true })
            } catch (error) {
                console.error('Unable to start captain location tracking:', error)
                acknowledge({ error: 'Unable to start live tracking right now.' })
            }
        })

        socket.on('disconnect', async () => {
            if (!captainId) return
            if (!await captainReady) return
            try {
                const disconnectedCaptain = await captainModel.findOneAndUpdate(
                    { _id: captainId, socketId: socket.id },
                    { $unset: { socketId: 1 }, $set: { status: 'inactive' } }
                )
                if (disconnectedCaptain) {
                    io.to(`captain:${captainId}`).emit('captain:offline')
                }
            } catch (error) {
                console.error('Unable to clear disconnected captain status:', error)
            }
        })
    })
}

module.exports = attachSocketHandlers
