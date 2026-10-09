const test = require('node:test')
const assert = require('node:assert/strict')
const { getFareOptions, validateTripLocations } = require('../services/ride.service')

const pickup = {
    name: 'Central Station',
    coordinates: { longitude: 74.3, latitude: 31.5 },
    countryCode: 'IN',
    regionCode: 'IN-PB'
}

test('fare quotes cover each vehicle with distance and duration rates', () => {
    assert.deepEqual(getFareOptions(10000, 600), {
        car: 215,
        bike: 110,
        rikshaw: 145
    })
})

test('fare quotes reject routes outside supported bounds', () => {
    assert.throws(() => getFareOptions(0, 60), /valid route/)
    assert.throws(() => getFareOptions(500001, 60), /valid route/)
    assert.throws(() => getFareOptions(10000, 0), /valid route/)
    assert.throws(() => getFareOptions(10000, 86401), /valid route/)
})

test('same-country same-region trips are accepted case-insensitively', () => {
    assert.doesNotThrow(() => validateTripLocations(pickup, {
        ...pickup,
        name: 'City Centre',
        countryCode: 'in',
        regionCode: 'in-pb'
    }))
})

test('cross-country and cross-region trips are rejected', () => {
    assert.throws(() => validateTripLocations(pickup, {
        ...pickup,
        countryCode: 'PK',
        regionCode: 'PK-PB'
    }), /same state or region/)

    assert.throws(() => validateTripLocations(pickup, {
        ...pickup,
        regionCode: 'IN-DL'
    }), /same state or region/)
})

test('locations must include state metadata and valid coordinates', () => {
    assert.throws(() => validateTripLocations(pickup, {
        ...pickup,
        regionCode: ''
    }), /state or region/)

    assert.throws(() => validateTripLocations(pickup, {
        ...pickup,
        coordinates: { longitude: 181, latitude: 31.5 }
    }), /coordinates/)
})
