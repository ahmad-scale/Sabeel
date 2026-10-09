const test = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')
const captainModel = require('../models/captain.model')
const blackListTokenModel = require('../models/blackListToken.model')
const { authCaptain } = require('../middlewares/auth.middleware')

test('captain auth rejects a valid token whose captain record no longer exists', async () => {
    const originalSecret = process.env.JWT_SECRET
    const originalFindCaptain = captainModel.findById
    const originalFindBlacklist = blackListTokenModel.findOne
    process.env.JWT_SECRET = 'middleware-test-secret'
    captainModel.findById = async () => null
    blackListTokenModel.findOne = async () => null

    let responseStatus
    let responseBody
    let nextCalled = false
    const response = {
        status(status) {
            responseStatus = status
            return this
        },
        json(body) {
            responseBody = body
            return this
        }
    }

    try {
        await authCaptain({
            cookies: {},
            headers: {
                authorization: `Bearer ${jwt.sign({ _id: '507f1f77bcf86cd799439011' }, process.env.JWT_SECRET)}`
            }
        }, response, () => {
            nextCalled = true
        })

        assert.equal(responseStatus, 401)
        assert.deepEqual(responseBody, { message: 'Unauthorized' })
        assert.equal(nextCalled, false)
    } finally {
        captainModel.findById = originalFindCaptain
        blackListTokenModel.findOne = originalFindBlacklist
        if (originalSecret === undefined) delete process.env.JWT_SECRET
        else process.env.JWT_SECRET = originalSecret
    }
})
