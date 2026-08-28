const userModel = require('../models/user.model')
const userService = require('../services/user.service')
const { validationResult } = require('express-validator')
const blackListTokenModel = require('../models/blackListToken.model')

module.exports.registerUser = async (req, res, next) => {

    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { fullname, email, password } = req.body;
        const hashedPassword = await userModel.hashPassword(password)

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        })

        const token = user.generateAuthToken()

        res.status(201).json(
            {
                message: 'User registered successfully',
                token: token,
                user: user,
            }
        )

    } catch (err) {
        res.status(500).json({
            error: 'Something went wrong while registering the user'
        })
        console.log(err)
    }
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('password')

    if (!user) {
        return res.status(401).json({
            message: 'Invalid email or password'
        })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = user.generateAuthToken()

    res.cookie('token', token)

    res.status(200).json({
        token: token,
        user: user
    })
}

module.exports.getUserProfile = async (req, res, next) => {

    res.status(200).json(req.user)

}

module.exports.logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization
    res.clearCookie('token')

    await blackListTokenModel.create()

    res.status(200).json({ message: 'Logged Out'})
}