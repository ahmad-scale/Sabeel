const crypto = require('crypto')
const mongoose = require('mongoose')
const rideModel = require('../models/ride.model')
const captainModel = require('../models/captain.model')

const fareRates = {
    car: { base: 45, perKm: 15, perMinute: 2 },
    bike: { base: 20, perKm: 8, perMinute: 1 },
    rikshaw: { base: 30, perKm: 10, perMinute: 1.5 }
}

const getFareOptions = (distanceMeters, durationSeconds) => {
    if (
        !Number.isFinite(distanceMeters) || distanceMeters < 1 || distanceMeters > 500000 ||
        !Number.isFinite(durationSeconds) || durationSeconds < 1 || durationSeconds > 86400
    ) {
        throw new Error('A valid route distance and duration are required.')
    }

    const distanceKm = distanceMeters / 1000
    const durationMinutes = durationSeconds / 60

    return Object.fromEntries(Object.entries(fareRates).map(([type, rates]) => [
        type,
        Math.round(rates.base + distanceKm * rates.perKm + durationMinutes * rates.perMinute)
    ]))
}

const validateLocation = (location, label) => {
    if (
        !location || typeof location.name !== 'string' || location.name.trim().length < 3 ||
        !Number.isFinite(location.coordinates?.longitude) ||
        location.coordinates.longitude < -180 || location.coordinates.longitude > 180 ||
        !Number.isFinite(location.coordinates?.latitude) ||
        location.coordinates.latitude < -90 || location.coordinates.latitude > 90 ||
        typeof location.countryCode !== 'string' || !location.countryCode.trim() ||
        typeof location.regionCode !== 'string' || !location.regionCode.trim()
    ) {
        throw new Error(`${label} must include a name, coordinates, country, and state or region.`)
    }
}

const normalize = (value) => value.trim().toLowerCase()

const assertSameState = (pickup, destination) => {
    if (
        normalize(pickup.countryCode) !== normalize(destination.countryCode) ||
        normalize(pickup.regionCode) !== normalize(destination.regionCode)
    ) {
        throw new Error('Trips must start and end within the same state or region of one country.')
    }
}

const validateTripLocations = (pickup, destination) => {
    validateLocation(pickup, 'Pickup')
    validateLocation(destination, 'Destination')
    assertSameState(pickup, destination)
}

const getCaptainDistanceKm = (captain, pickup) => {
    const location = captain.location
    if (!Number.isFinite(location?.lat) || !Number.isFinite(location?.lng)) return Infinity

    const radians = (degrees) => degrees * Math.PI / 180
    const dLat = radians(pickup.coordinates.latitude - location.lat)
    const dLng = radians(pickup.coordinates.longitude - location.lng)
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(radians(location.lat)) * Math.cos(radians(pickup.coordinates.latitude)) *
        Math.sin(dLng / 2) ** 2
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const createRide = async ({ userId, pickup, destination, vehicleType, distanceMeters, durationSeconds }) => {
    validateTripLocations(pickup, destination)
    if (!fareRates[vehicleType]) throw new Error('Choose a valid vehicle type.')

    const existingRide = await rideModel.exists({
        user: userId,
        status: { $in: ['requested', 'accepted', 'ongoing'] }
    })
    if (existingRide) throw new Error('You already have an active ride.')

    const fares = getFareOptions(distanceMeters, durationSeconds)
    const ride = await rideModel.create({
        user: userId,
        pickup,
        destination,
        vehicleType,
        distanceMeters,
        durationSeconds,
        fare: fares[vehicleType],
        otp: crypto.randomInt(100000, 1000000).toString()
    })

    return ride
}

const findNearbyCaptains = async (pickup, vehicleType, radiusKm = 2) => {
    const captains = await captainModel.find({
        status: 'active',
        socketId: { $exists: true, $ne: null },
        'vehicle.vehicleType': vehicleType
    }).select('fullname vehicle location socketId')

    return captains.filter((captain) => getCaptainDistanceKm(captain, pickup) <= radiusKm)
}

const findPendingRidesForCaptain = async (captainId, radiusKm = 2) => {
    const captain = await captainModel.findOne({
        _id: captainId,
        status: 'active',
        socketId: { $exists: true, $ne: null }
    }).select('vehicle.vehicleType location')
    if (!captain) return []

    const rides = await rideModel.find({
        status: 'requested',
        vehicleType: captain.vehicle.vehicleType
    }).populate('user', 'fullname')

    return rides.filter((ride) => getCaptainDistanceKm(captain, ride.pickup) <= radiusKm)
}

const acceptRide = async ({ rideId, captain }) => {
    if (!mongoose.isValidObjectId(rideId)) throw new Error('Ride not found.')
    const onlineCaptain = await captainModel.exists({
        _id: captain._id,
        status: 'active',
        socketId: { $exists: true, $ne: null }
    })
    if (!onlineCaptain) throw new Error('Go online before accepting a ride.')

    const ride = await rideModel.findOneAndUpdate(
        {
            _id: rideId,
            status: 'requested',
            vehicleType: captain.vehicle.vehicleType
        },
        { $set: { status: 'accepted', captain: captain._id } },
        { new: true }
    ).populate('user', 'fullname email').populate('captain', 'fullname vehicle')
        .select('+otp')

    if (!ride) throw new Error('This ride is no longer available for your vehicle.')
    return ride
}

const getRideForActor = async ({ rideId, actorId, role }) => {
    if (!mongoose.isValidObjectId(rideId)) throw new Error('Ride not found.')
    const filter = { _id: rideId }
    filter[role === 'captain' ? 'captain' : 'user'] = actorId
    const ride = await rideModel.findOne(filter)
        .populate('user', 'fullname email')
        .populate('captain', 'fullname vehicle')
        .select('+otp')
    if (!ride) throw new Error('Ride not found.')
    return ride
}

const getActiveRide = async ({ actorId, role }) => {
    const filter = {
        [role === 'captain' ? 'captain' : 'user']: actorId,
        status: { $in: role === 'captain' ? ['accepted', 'ongoing'] : ['requested', 'accepted', 'ongoing'] }
    }
    const rideQuery = rideModel.findOne(filter)
        .sort({ createdAt: -1 })
        .populate('user', 'fullname email')
        .populate('captain', 'fullname vehicle')
    if (role === 'user') rideQuery.select('+otp')
    return rideQuery
}

const startRide = async ({ rideId, otp, captain }) => {
    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, captain: captain._id, status: 'accepted', otp },
        { $set: { status: 'ongoing' } },
        { new: true }
    ).populate('user', 'fullname email').populate('captain', 'fullname vehicle')
    if (!ride) throw new Error('Invalid OTP or ride is not ready to start.')
    return ride
}

const completeRide = async ({ rideId, captain }) => {
    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, captain: captain._id, status: 'ongoing' },
        { $set: { status: 'completed' } },
        { new: true }
    ).populate('user', 'fullname email').populate('captain', 'fullname vehicle')
    if (!ride) throw new Error('Ride not found or is not in progress.')
    return ride
}

const cancelRide = async ({ rideId, userId }) => {
    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, user: userId, status: 'requested' },
        { $set: { status: 'cancelled' } },
        { new: true }
    )
    if (!ride) throw new Error('Only a requested ride can be canceled.')
    return ride
}

module.exports = {
    getFareOptions,
    validateTripLocations,
    createRide,
    findNearbyCaptains,
    findPendingRidesForCaptain,
    acceptRide,
    getRideForActor,
    getActiveRide,
    startRide,
    completeRide,
    cancelRide
}
