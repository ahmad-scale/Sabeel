const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const captainController = require('../controllers/captain.controller')

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min: 3}).withMessage('first name must be atleast 3 characters long!'),
    body('password').isLength({min: 6}).withMessage("Password must be atleast 6 characters long!"),
    body('vehicle.color').isLength({ min: 3}).withMessage('Vehicle color must be atleast 3 characters long!'),
    body('vehicle.plate').isLength({ min: 3}).withMessage('Plate number must be atleast 3 characters long!'),
    body('vehicle.capacity').isInt({ min: 1}).withMessage('Vehicle capacity must be atleast 1!'),
    body('vehicle.vehicleType').isIn(['car', 'bike', 'rikshaw']).withMessage('Invalid Vehicle Type!')
],
    captainController.registerCaptain
)

module.exports = router