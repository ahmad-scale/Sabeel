import { useCallback, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmedVehicle from '../components/ConfirmedVehicle'
import LookingForDriver from '../components/LookingForDriver'
import MapComponent from '../components/Map'
import { getTripLocationError } from '../utils/tripLocationValidation'
import { API_BASE_URL, authHeaders } from '../services/api'
import { useRideUpdates } from '../services/liveTracking'

const formatDuration = (seconds) => {
  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours ? `${hours} hr ${minutes} min` : `${totalMinutes} min`
}

const Home = () => {
  const [pickup, setPickup] = useState(null)
  const [destination, setDestination] = useState(null)
  const [searchField, setSearchField] = useState('pickup')
  const [locationQuery, setLocationQuery] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const confirmedRidePanelRef = useRef(null)
  const panelCloseRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmedRidePanel, setConfirmedRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [tripError, setTripError] = useState('')
  const [routeInfo, setRouteInfo] = useState(null)
  const [fareQuote, setFareQuote] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState('car')
  const [activeRide, setActiveRide] = useState(null)
  const [isRequestingRide, setIsRequestingRide] = useState(false)
  const navigate = useNavigate()
  const currentRouteKey = pickup?.coordinates && destination?.coordinates
    ? `${pickup.coordinates.longitude},${pickup.coordinates.latitude};${destination.coordinates.longitude},${destination.coordinates.latitude}`
    : null

  useEffect(() => {
    if (!routeInfo || routeInfo.key !== currentRouteKey) return undefined

    const controller = new AbortController()
    axios.get(`${API_BASE_URL}/rides/fare`, {
      params: {
        distanceMeters: routeInfo.distance,
        durationSeconds: routeInfo.duration,
      },
      headers: authHeaders(),
      signal: controller.signal,
    }).then(({ data }) => {
      setFareQuote({ key: routeInfo.key, fares: data.fares })
    }).catch((error) => {
      if (error.name !== 'CanceledError') {
        setTripError(error.response?.data?.message || 'Unable to calculate ride fares.')
      }
    })

    return () => controller.abort()
  }, [routeInfo, currentRouteKey])
  const fares = fareQuote?.key === currentRouteKey ? fareQuote.fares : null
  const handleRideUpdate = useCallback((event) => {
    if (event.type === 'ride-confirmed' && event.ride?._id) {
      const ride = event.ride
      const acceptedRide = { ...activeRide, ...ride }
      setActiveRide(acceptedRide)
      setVehicleFound(false)
      navigate(`/riding/${ride._id}`, {
        state: {
          ride: acceptedRide,
          captainId: acceptedRide.captain?._id,
          captain: acceptedRide.captain,
          pickup: acceptedRide.pickup,
          destination: acceptedRide.destination,
        },
      })
      return
    }
    if (!activeRide) return
    if (event.type === 'ride-cancelled' && event.rideId === activeRide._id) {
      setActiveRide(null)
      setVehicleFound(false)
      setTripError('The ride request was canceled.')
    } else if (event.type === 'error') {
      setTripError(event.message)
    }
  }, [activeRide, navigate])
  useRideUpdates('rider-session', handleRideUpdate)

  useEffect(() => {
    if (!activeRide?._id || activeRide.status !== 'requested') return undefined

    const controller = new AbortController()
    const checkRideStatus = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/rides/${activeRide._id}`, {
          headers: authHeaders(),
          signal: controller.signal,
        })
        if (data.ride.status === 'accepted' || data.ride.status === 'ongoing') {
          handleRideUpdate({ type: 'ride-confirmed', ride: data.ride })
        }
      } catch (error) {
        if (error.name !== 'CanceledError') {
          setTripError(error.response?.data?.message || 'Unable to refresh ride status.')
        }
      }
    }

    const intervalId = window.setInterval(checkRideStatus, 5000)
    return () => {
      controller.abort()
      window.clearInterval(intervalId)
    }
  }, [activeRide, handleRideUpdate])

  useEffect(() => {
    const controller = new AbortController()
    axios.get(`${API_BASE_URL}/rides/active`, {
      headers: authHeaders(),
      signal: controller.signal,
    }).then(({ data }) => {
      if (!data.ride) return
      setActiveRide(data.ride)
      if (data.ride.status === 'requested') {
        setVehicleFound(true)
        return
      }
      navigate(`/riding/${data.ride._id}`, {
        replace: true,
        state: {
          ride: data.ride,
          captainId: data.ride.captain?._id,
          captain: data.ride.captain,
        },
      })
    }).catch((error) => {
      if (error.name !== 'CanceledError') {
        setTripError(error.response?.data?.message || 'Unable to restore your active ride.')
      }
    })
    return () => controller.abort()
  }, [navigate])


  const submitHandler = (e) => {
    e.preventDefault()
    if (pickup && destination) setVehiclePanel(true)
  }

  const selectLocation = (location) => {
    setTripError('')
    if (searchField === 'pickup') {
      setPickup(location)
      setSearchField('destination')
      setLocationQuery('')
      setPanelOpen(false)
      return
    }
    setDestination(location)
    setLocationQuery('')
    setPanelOpen(false)
    setVehiclePanel(true)
  }

  const confirmRide = async () => {
    const error = getTripLocationError(pickup, destination)
    if (error) {
      setTripError(error)
      setConfirmedRidePanel(false)
      setVehiclePanel(false)
      return
    }

    if (!routeInfo || routeInfo.key !== currentRouteKey || !fares?.[selectedVehicle]) {
      setTripError('Please wait for a valid route and fare estimate before confirming.')
      return
    }

    setIsRequestingRide(true)
    setTripError('')
    try {
      const { data } = await axios.post(`${API_BASE_URL}/rides`, {
        pickup,
        destination,
        vehicleType: selectedVehicle,
        distanceMeters: routeInfo.distance,
        durationSeconds: routeInfo.duration,
      }, { headers: authHeaders() })
      setActiveRide({ ...data.ride, nearbyCaptains: data.nearbyCaptains })
      setVehicleFound(true)
      setConfirmedRidePanel(false)
      setVehiclePanel(false)
    } catch (requestError) {
      setTripError(
        requestError.response?.data?.message ||
        requestError.response?.data?.errors?.[0]?.msg ||
        'Unable to request a ride. Please try again.'
      )
    } finally {
      setIsRequestingRide(false)
    }
  }

  const cancelRide = async () => {
    if (!activeRide?._id) return
    try {
      await axios.post(`${API_BASE_URL}/rides/${activeRide._id}/cancel`, {}, {
        headers: authHeaders(),
      })
      setActiveRide(null)
      setVehicleFound(false)
    } catch (cancelError) {
      setTripError(cancelError.response?.data?.message || 'Unable to cancel this ride request.')
    }
  }

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '80%',
        opacity: 1,
        padding: 25
      })
      gsap.to(panelCloseRef.current, {
        opacity: 1
      })
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0
        // opacity: 0
      })
      gsap.to(panelCloseRef.current, {
        opacity: 0
      })
    }
  }, [panelOpen])

  useGSAP(function () {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehiclePanel])

  useGSAP(function () {
    if (confirmedRidePanel) {
      gsap.to(confirmedRidePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmedRidePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmedRidePanel])

  useGSAP(function () {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehicleFound])

  return (
    <div className='fixed inset-0 h-dvh w-full overflow-hidden'>

      <Link
        to='/users/logout'
        aria-label='Log out'
        title='Log out'
        className='fixed right-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-700 bg-white text-emerald-950 shadow-lg'
      >
        <i className='ri-logout-box-r-line text-2xl' aria-hidden='true' />
      </Link>
      <div onClick={() => { setVehiclePanel(false) }} className='fixed inset-0 z-0 h-dvh w-full overflow-hidden bg-slate-200'>
        <MapComponent
          pickup={pickup?.coordinates}
          destination={destination?.coordinates}
          onRouteInfo={setRouteInfo}
          showUserLocation
        />
        <div className='pointer-events-none absolute inset-0 flex flex-col justify-start px-6 pt-8 md:px-12 lg:px-20'>
          <h1 className='m-0 inline-block pb-6 text-5xl font-bold text-emerald-950 drop-shadow-sm'>Sabeel</h1>
        </div>

      </div>
      {tripError && (
        <div role='alert' className='fixed left-1/2 top-20 z-30 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-start justify-between gap-4 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-800 shadow-lg'>
          <p>{tripError}</p>
          <button
            type='button'
            className='shrink-0 font-semibold'
            aria-label='Dismiss trip error'
            onClick={() => setTripError('')}
          >
            Dismiss
          </button>
        </div>
      )}
      <div className=' pointer-events-none fixed inset-0 z-10 flex h-dvh w-full flex-col justify-end overflow-hidden'>
        <div className='pointer-events-auto relative max-h-[50svh] overflow-y-auto bg-white px-4 pb-4 pt-5 sm:px-6 sm:pb-6'>
          <h5 ref={panelCloseRef} onClick={() => { setPanelOpen(false) }} className=' opacity-0 absolute top-5 left-5 text-3xl'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='text-center text-2xl font-semibold text-emerald-950 sm:text-3xl'>Find a trip</h4>
          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
            <div className="line absolute h-20 w-1.5 rounded-full top-[45%] left-10 bg-teal-800"></div>
            <input
              onFocus={() => { setSearchField('pickup'); setLocationQuery(pickup?.name || ''); setPanelOpen(true) }}
              value={searchField === 'pickup' && panelOpen ? locationQuery : pickup?.name || ''}
              onChange={(e) => { setTripError(''); setPickup(null); setSearchField('pickup'); setLocationQuery(e.target.value); setPanelOpen(true) }}
              className='mb-2 mt-4 w-full rounded-t-2xl bg-[#eee] px-10 py-3 text-base sm:rounded-t-3xl sm:px-12 sm:py-4 sm:text-xl'
              type='text'
              placeholder='Add a pick-up location'
              aria-label='Pick-up location'
            />
            <input
              onFocus={() => { setSearchField('destination'); setLocationQuery(destination?.name || ''); setPanelOpen(true) }}
              value={searchField === 'destination' && panelOpen ? locationQuery : destination?.name || ''}
              onChange={(e) => { setTripError(''); setDestination(null); setSearchField('destination'); setLocationQuery(e.target.value); setPanelOpen(true) }}
              className='w-full rounded-b-2xl bg-[#eee] px-10 py-3 text-base sm:rounded-b-3xl sm:px-12 sm:py-4 sm:text-xl'
              type='text'
              placeholder='Enter your destination'
              aria-label='Destination'
            />
          </form>
          {routeInfo?.key === currentRouteKey && (
            <p role='status' className='mt-3 rounded-xl bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-950'>
              Estimated route: {(routeInfo.distance / 1000).toFixed(1)} km · about {formatDuration(routeInfo.duration)} by car
            </p>
          )}
        </div>
        <div ref={panelRef} className='pointer-events-auto max-h-[75svh] h-0 overflow-y-auto bg-white'>
          <LocationSearchPanel query={locationQuery} onSelect={selectLocation} />
        </div>
      </div>
      <div ref={vehiclePanelRef} className='fixed bottom-0 z-20 max-h-[85svh] w-full translate-y-full overflow-y-auto rounded-t-3xl border border-emerald-950 bg-white px-3 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:left-0 sm:right-0 sm:mx-auto sm:max-w-xl sm:py-8'>
        <VehiclePanel
          fares={fares}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={setSelectedVehicle}
          setConfirmedRidePanel={setConfirmedRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>
      <div ref={confirmedRidePanelRef} className='fixed bottom-0 z-20 max-h-[90svh] w-full translate-y-full overflow-y-auto rounded-t-3xl border border-emerald-950 bg-white px-3 py-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:left-0 sm:right-0 sm:mx-auto sm:max-w-xl'>
        <ConfirmedVehicle
          pickup={pickup}
          destination={destination}
          routeInfo={routeInfo?.key === currentRouteKey ? routeInfo : null}
          fare={fares?.[selectedVehicle]}
          vehicleType={selectedVehicle}
          isSubmitting={isRequestingRide}
          setConfirmedRidePanel={setConfirmedRidePanel}
          onConfirm={confirmRide}
          setVehiclePanel={setVehiclePanel}
        />
      </div>
      <div ref={vehicleFoundRef} className='fixed bottom-0 z-20 max-h-[90svh] w-full translate-y-full overflow-y-auto rounded-t-3xl border border-emerald-950 bg-white px-3 py-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:left-0 sm:right-0 sm:mx-auto sm:max-w-xl'>
        <LookingForDriver
          ride={activeRide}
          setVehicleFound={setVehicleFound}
          onCancel={cancelRide}
        />
      </div>
    </div>
  )
}

export default Home