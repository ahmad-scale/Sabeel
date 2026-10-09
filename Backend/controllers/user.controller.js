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

        const { fullname, password } = req.body;
        const email = req.body.email.trim().toLowerCase()

        const isUserAlreadyExist = await userModel.findOne({ email })

        if (isUserAlreadyExist) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }

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

    const email = req.body.email.trim().toLowerCase()
    const { password } = req.body

    const emailPattern = new RegExp(
        `^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
        'i'
    )
    const user = await userModel.findOne({ email: emailPattern }).select('+password')

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
    const userData = user.toObject()
    delete userData.password

    res.cookie('token', token)

    res.status(200).json({
        token: token,
        user: userData
    })
}

module.exports.getUserProfile = async (req, res, next) => {

    res.status(200).json({ user: req.user })

}

module.exports.logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    res.clearCookie('token')

    await blackListTokenModel.create({ token })

    res.status(200).json({ message: 'Logged Out' })
}