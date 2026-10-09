const express = require('express')
const { body, param, query } = require('express-validator')
const rideController = require('../controllers/ride.controller')
const { authUser, authCaptain, authRideActor } = require('../middlewares/auth.middleware')

const router = express.Router()

const routeValidation = [
    body('pickup.name').isString().trim().isLength({ min: 3 }),
    body('pickup.coordinates.longitude').isFloat({ min: -180, max: 180 }),
    body('pickup.coordinates.latitude').isFloat({ min: -90, max: 90 }),
    body('pickup.countryCode').isString().trim().notEmpty(),
    body('pickup.regionCode').isString().trim().notEmpty(),
    body('destination.name').isString().trim().isLength({ min: 3 }),
    body('destination.coordinates.longitude').isFloat({ min: -180, max: 180 }),
    body('destination.coordinates.latitude').isFloat({ min: -90, max: 90 }),
    body('destination.countryCode').isString().trim().notEmpty(),
    body('destination.regionCode').isString().trim().notEmpty(),
    body('vehicleType').isIn(['car', 'bike', 'rikshaw']),
    body('distanceMeters').isFloat({ min: 1, max: 500000 }),
    body('durationSeconds').isFloat({ min: 1, max: 86400 })
]

router.get('/fare', authUser,
    query('distanceMeters').isFloat({ min: 1, max: 500000 }),
    query('durationSeconds').isFloat({ min: 1, max: 86400 }),
    rideController.getFare
)
router.get('/captain/stats', authCaptain, rideController.getCaptainStats)
router.get('/active', authRideActor, rideController.getActiveRide)

router.post('/', authUser, routeValidation, rideController.createRide)
router.get('/:rideId', authRideActor, param('rideId').isMongoId(), rideController.getRide)
router.post('/:rideId/accept', authCaptain, param('rideId').isMongoId(), rideController.acceptRide)
router.post('/:rideId/start', authCaptain,
    param('rideId').isMongoId(),
    body('otp').isString().isLength({ min: 6, max: 6 }).isNumeric(),
    rideController.startRide
)
router.post('/:rideId/complete', authCaptain, param('rideId').isMongoId(), rideController.completeRide)
router.post('/:rideId/cancel', authUser, param('rideId').isMongoId(), rideController.cancelRide)

module.exports = router
