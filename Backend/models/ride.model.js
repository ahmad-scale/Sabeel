const mongoose = require('mongoose')

const rideLocationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    coordinates: {
        longitude: { type: Number, required: true, min: -180, max: 180 },
        latitude: { type: Number, required: true, min: -90, max: 90 }
    },
    countryCode: { type: String, required: true, trim: true },
    regionCode: { type: String, required: true, trim: true }
}, { _id: false })

const rideSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    captain: { type: mongoose.Schema.Types.ObjectId, ref: 'captain', default: null },
    pickup: { type: rideLocationSchema, required: true },
    destination: { type: rideLocationSchema, required: true },
    vehicleType: { type: String, enum: ['car', 'bike', 'rikshaw'], required: true },
    distanceMeters: { type: Number, required: true, min: 1 },
    durationSeconds: { type: Number, required: true, min: 1 },
    fare: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'requested',
        index: true
    },
    otp: { type: String, required: true, select: false }
}, { timestamps: true })

rideSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.model('ride', rideSchema)
