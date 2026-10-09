const { validationResult } = require('express-validator')
const rideService = require('../services/ride.service')

const validationErrors = (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) return false
    res.status(400).json({ errors: errors.array() })
    return true
}

const fail = (res, error) => {
    const message = error.message || 'Unable to complete the ride request.'
    const status = /not found|no longer available|only a requested|not in progress|invalid otp/i.test(message)
        ? 404
        : /required|valid|choose|same state|same region|within the same|go online|active ride/i.test(message)
            ? 400
            : 500
    if (status === 500) {
        console.error('Ride request failed:', error)
        return res.status(status).json({ message: 'Unable to complete the ride request right now.' })
    }
    return res.status(status).json({ message })
}

const safeRide = (ride, includeOtp = false) => {
    const result = ride.toObject ? ride.toObject() : { ...ride }
    if (!includeOtp) delete result.otp
    return result
}

module.exports.getFare = async (req, res) => {
    if (validationErrors(req, res)) return
    try {
        const { distanceMeters, durationSeconds } = req.query
        const fares = rideService.getFareOptions(Number(distanceMeters), Number(durationSeconds))
        return res.status(200).json({ fares })
    } catch (error) {
        return fail(res, error)
    }
}

module.exports.createRide = async (req, res) => {
    if (validationErrors(req, res)) return
    try {
        const ride = await rideService.createRide({
            userId: req.user._id,
            ...req.body
        })
        const io = req.app.get('io')
        const captains = await rideService.findNearbyCaptains(ride.pickup, ride.vehicleType)
        for (const captain of captains) {
            if (captain.socketId) {
                io?.to(captain.socketId).emit('new-ride', {
                    ride: safeRide(ride),
                    rider: { fullname: req.user.fullname }
                })
            }
        }
        return res.status(201).json({ ride: safeRide(ride, true), nearbyCaptains: captains.length })
    } catch (error) {
        return fail(res, error)
    }
}

module.exports.acceptRide = async (req, res) => {
    if (validationErrors(req, res)) return
    try {
        const ride = await rideService.acceptRide({ rideId: req.params.rideId, captain: req.captain })
        const response = safeRide(ride)
        const io = req.app.get('io')
        io?.to(`user:${ride.user._id}`).emit('ride-confirmed', {
            ride: safeRide(ride, true)
        })
        io?.emit('ride-taken', { rideId: ride._id.toString(), captainId: req.captain._id.toString() })
        return res.status(200).json({ ride: response })
    } catch (error) {
        return fail(res, error)
    }
}

module.exports.getRide = async (req, res) => {
    try {
        const ride = await rideService.getRideForActor({
            rideId: req.params.rideId,
            actorId: req.user?._id || req.captain?._id,
            role: req.user ? 'user' : 'captain'
        })
        return res.status(200).json({ ride: safeRide(ride, Boolean(req.user)) })
    } catch (error) {
        return fail(res, error)
    }
}

module.exports.getActiveRide = async (req, res) => {
    try {
        const ride = await rideService.getActiveRide({
            actorId: req.user?._id || req.captain?._id,
            role: req.user ? 'user' : 'captain'
        })
        return res.status(200).json({ ride: ride ? safeRide(ride, Boolean(req.user)) : null })
    } catch (error) {
        return fail(res, error)
    }
}

module.exports.startRide = async (req, res) => {
    if (validationErrors(req, res)) return
    try {
        const ride = await rideService.startRide({
            rideId: req.params.rideId,
            otp: req.body.otp,
            captain: req.captain
        })
        const response = safeRide(ride)
        req.app.get('io')?.to(`user:${ride.user._id}`).emit('ride-started', { ride: response })
        return res.status(200).json({ ride: response })
    } catch (error) {
        return fail(res, error)
    }
}

module.exports.completeRide = async (req, res) => {
    if (validationErrors(req, res)) return
    try {
        const ride = await rideService.completeRide({
            rideId: req.params.rideId,
            captain: req.captain
        })
        const response = safeRide(ride)
        req.app.get('io')?.to(`user:${ride.user._id}`).emit('ride-ended', { ride: response })
        return res.status(200).json({ ride: response })
    } catch (error) {
        return fail(res, error)
    }
}

module.exports.cancelRide = async (req, res) => {
    try {
        const ride = await rideService.cancelRide({
            rideId: req.params.rideId,
            userId: req.user._id
        })
        req.app.get('io')?.emit('ride-cancelled', { rideId: ride._id.toString() })
        return res.status(200).json({ ride: safeRide(ride) })
    } catch (error) {
        return fail(res, error)
    }
}

module.exports.getCaptainStats = async (req, res) => {
    if (!req.captain?._id) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const rideModel = require('../models/ride.model')
        const [stats] = await rideModel.aggregate([
            { $match: { captain: req.captain._id, status: 'completed' } },
            {
                $group: {
                    _id: null,
                    completedRides: { $sum: 1 },
                    earnings: { $sum: '$fare' },
                    distanceMeters: { $sum: '$distanceMeters' }
                }
            }
        ])
        return res.status(200).json({
            completedRides: stats?.completedRides || 0,
            earnings: stats?.earnings || 0,
            distanceKm: (stats?.distanceMeters || 0) / 1000
        })
    } catch (error) {
        console.error('Unable to load captain ride statistics:', error)
        return res.status(500).json({ message: 'Unable to load captain statistics right now.' })
    }
}
