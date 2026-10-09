import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { API_BASE_URL } from './api'

const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token?.startsWith('"') || !token.endsWith('"')) return token
  try {
    return JSON.parse(token)
  } catch {
    return token
  }
}

export const useCaptainLocationPublisher = (enabled) => {
  const [trackingStatus, setTrackingStatus] = useState('connecting')
  const [trackingError, setTrackingError] = useState('')
  const [incomingRide, setIncomingRide] = useState(null)
  const ignoredRideIds = useRef(new Set())
  const token = getToken()
  const geolocationAvailable = typeof navigator !== 'undefined' && Boolean(navigator.geolocation)

  useEffect(() => {
    if (!enabled || !token || !geolocationAvailable) return undefined

    const socket = io(API_BASE_URL, { auth: { token }, autoConnect: false })
    let watchId
    const onConnect = () => {
      if (watchId !== undefined) return
      setTrackingStatus('locating')
      watchId = navigator.geolocation.watchPosition(
        ({ coords }) => {
          if (!socket.connected) return
          const location = { latitude: coords.latitude, longitude: coords.longitude }
          socket.timeout(10000).emit('captain:location:update', location, (socketError, response) => {
            if (socketError) {
              setTrackingStatus('error')
              setTrackingError('The server did not confirm your live location.')
              return
            }
            if (response?.error) {
              setTrackingStatus('error')
              setTrackingError(response.error)
              return
            }
            setTrackingStatus('live')
            setTrackingError('')
          })
        },
        (error) => {
          setTrackingStatus('error')
          setTrackingError(`Location access failed: ${error.message}`)
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
      )
    }
    const onConnectError = (error) => {
      setTrackingStatus('error')
      setTrackingError(error.message || 'Unable to connect to live tracking.')
    }
    const onDisconnect = () => setTrackingStatus('connecting')
    const onRide = (payload) => {
      const rideId = payload?.ride?._id
      if (!rideId || ignoredRideIds.current.has(rideId)) return
      setIncomingRide((current) => (
        current?.ride?._id === rideId ? current : payload
      ))
    }
    const onRideDismissed = ({ rideId }) => {
      setIncomingRide((current) => (
        current?.ride?._id === rideId ? null : current
      ))
    }

    socket.on('connect', onConnect)
    socket.on('connect_error', onConnectError)
    socket.on('disconnect', onDisconnect)
    socket.on('new-ride', onRide)
    socket.on('ride-cancelled', onRideDismissed)
    socket.on('ride-taken', onRideDismissed)
    socket.connect()
    return () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId)
      socket.off('connect', onConnect)
      socket.off('connect_error', onConnectError)
      socket.off('disconnect', onDisconnect)
      socket.off('new-ride', onRide)
      socket.off('ride-cancelled', onRideDismissed)
      socket.off('ride-taken', onRideDismissed)
      socket.disconnect()
    }
  }, [enabled, token, geolocationAvailable])

  const ignoreIncomingRide = () => {
    if (incomingRide?.ride?._id) ignoredRideIds.current.add(incomingRide.ride._id)
    setIncomingRide(null)
  }

  return {
    trackingStatus: !token || !geolocationAvailable ? 'error' : trackingStatus,
    trackingError: !token
      ? 'Sign in again to share your live location.'
      : !geolocationAvailable
        ? 'This browser does not support location tracking.'
        : trackingError,
    incomingRide,
    setIncomingRide,
    ignoreIncomingRide,
  }
}

export const useLiveCaptainLocation = (captainId) => {
  const [driverLocation, setDriverLocation] = useState(null)
  const [trackingError, setTrackingError] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const token = getToken()

  useEffect(() => {
    if (!captainId || !token) return undefined

    const socket = io(API_BASE_URL, { auth: { token }, autoConnect: false })
    const onConnect = () => {
      setIsConnected(true)
      socket.emit('captain:watch', captainId, (response) => {
        if (response?.error) setTrackingError(response.error)
        else setTrackingError('')
      })
    }
    const onLocation = (location) => {
      setDriverLocation(location)
      setTrackingError('')
    }
    const onCaptainOffline = () => {
      setDriverLocation(null)
      setTrackingError('The driver is no longer sharing a live location.')
    }
    const onError = (error) => setTrackingError(error.message || 'Live tracking is unavailable.')
    const onDisconnect = () => setIsConnected(false)

    socket.on('connect', onConnect)
    socket.on('connect_error', onError)
    socket.on('captain:location', onLocation)
    socket.on('captain:offline', onCaptainOffline)
    socket.on('tracking:error', onError)
    socket.on('disconnect', onDisconnect)
    socket.connect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('connect_error', onError)
      socket.off('captain:location', onLocation)
      socket.off('captain:offline', onCaptainOffline)
      socket.off('tracking:error', onError)
      socket.off('disconnect', onDisconnect)
      socket.disconnect()
    }
  }, [captainId, token])

  return {
    driverLocation,
    trackingError: !token && captainId ? 'Sign in to view live driver location.' : trackingError,
    isConnected,
  }
}

export const useRideUpdates = (rideId, onRideUpdate) => {
  const token = getToken()
  const onRideUpdateRef = useRef(onRideUpdate)

  useEffect(() => {
    onRideUpdateRef.current = onRideUpdate
  }, [onRideUpdate])

  useEffect(() => {
    if (!rideId || !token) return undefined

    const socket = io(API_BASE_URL, { auth: { token }, autoConnect: false })
    const eventNames = ['ride-confirmed', 'ride-started', 'ride-ended', 'ride-cancelled']
    const listeners = eventNames.map((eventName) => {
      const listener = (payload) => onRideUpdateRef.current({ type: eventName, ...payload })
      socket.on(eventName, listener)
      return [eventName, listener]
    })
    const onConnectError = (error) => {
      onRideUpdateRef.current({ type: 'error', message: error.message || 'Unable to connect to ride updates.' })
    }
    socket.on('connect_error', onConnectError)
    socket.connect()

    return () => {
      for (const [eventName, listener] of listeners) socket.off(eventName, listener)
      socket.off('connect_error', onConnectError)
      socket.disconnect()
    }
  }, [rideId, token])
}
