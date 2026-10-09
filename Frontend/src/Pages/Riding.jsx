import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import carImage from '../assets/car.png'
import MapComponent from '../components/Map'
import { useLiveCaptainLocation, useRideUpdates } from '../services/liveTracking'
import { API_BASE_URL, authHeaders } from '../services/api'

const Riding = () => {
  const route = useLocation()
  const { rideId } = useParams()
  const [ride, setRide] = useState(route.state?.ride || null)
  const [loadError, setLoadError] = useState('')
  const [rideError, setRideError] = useState('')
  const captainId = ride?.captain?._id || route.state?.captainId || localStorage.getItem('activeCaptainId')
  const { driverLocation, trackingError, isConnected } = useLiveCaptainLocation(captainId)

  useEffect(() => {
    if (ride || !rideId) return undefined
    const controller = new AbortController()
    axios.get(`${API_BASE_URL}/rides/${rideId}`, {
      headers: authHeaders(),
      signal: controller.signal,
    }).then(({ data }) => setRide(data.ride))
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          setLoadError(error.response?.data?.message || 'Unable to load this trip.')
        }
      })
    return () => controller.abort()
  }, [rideId, ride])

  const handleRideUpdate = useCallback((event) => {
    if (event.ride && event.ride._id === (rideId || ride?._id)) setRide(event.ride)
    if (event.type === 'error') setRideError(event.message)
  }, [rideId, ride?._id])
  useRideUpdates(rideId || ride?._id, handleRideUpdate)

  return (
    <div className='flex h-dvh flex-col overflow-hidden md:flex-row'>
      <Link to='/home' className='fixed right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-700 bg-white' aria-label='Return to home'>
        <i className='ri-home-5-line text-2xl' />
      </Link>
      <div className='min-h-[46svh] min-w-0 flex-1 md:min-h-0'>
        <MapComponent pickup={ride?.pickup?.coordinates} destination={ride?.destination?.coordinates} driverLocation={driverLocation} showUserLocation />
      </div>
      <div className='max-h-[54svh] shrink-0 overflow-y-auto rounded-t-3xl bg-white p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6 md:h-full md:max-h-none md:w-[min(28rem,40vw)] md:rounded-none md:shadow-xl'>
        {loadError && <p role='alert' className='mb-2 text-sm text-red-700'>{loadError}</p>}
        {captainId && (
          <p className={`mb-2 text-sm ${driverLocation ? 'text-emerald-800' : 'text-slate-600'}`} role='status'>
            {trackingError || (driverLocation ? 'Driver location is live' : isConnected ? 'Waiting for driver location…' : 'Connecting to driver…')}
          </p>
        )}
        <div className='mb-4 flex items-center justify-between gap-3'>
          <img className='h-20 w-28 shrink-0 object-contain' src={carImage} alt='' />
          <div className='text-right'>
            <h2 className='text-lg font-medium'>{ride?.captain?.fullname?.firstname || route.state?.captain?.fullname?.firstname || 'Finding your driver'}</h2>
            <h4 className='text-xl font-semibold'>{ride?.captain?.vehicle?.plate || 'Driver details'}</h4>
            <p className='text-sm text-gray-700'>{ride?.captain?.vehicle?.vehicleType || ''}</p>
          </div>
        </div>
        <div className='mb-3 border-b p-3'>
          <h3 className='font-medium'>Pickup</h3><p className='text-sm text-gray-700'>{ride?.pickup?.name}</p>
        </div>
        <div className='mb-3 border-b p-3'>
          <h3 className='font-medium'>Destination</h3><p className='text-sm text-gray-700'>{ride?.destination?.name}</p>
        </div>
        <div className='mb-3 flex items-center justify-between p-3'>
          <span>Fare · {ride?.status || 'requesting'}</span><strong>₹{ride?.fare ?? '—'}</strong>
        </div>
        {ride?.otp && ride.status !== 'completed' && (
          <p className='rounded-xl bg-emerald-50 p-3 text-center text-sm text-emerald-950'>
            Share ride verification code <strong className='ml-2 text-lg tracking-widest'>{ride.otp}</strong> with your driver.
          </p>
        )}
        {ride?.status === 'completed' && <p role='status' className='rounded-xl bg-emerald-50 p-3 text-center text-emerald-900'>Trip completed. Thank you for riding with Sabeel.</p>}
        {rideError && <p role='alert' className='mt-3 text-sm text-red-700'>{rideError}</p>}
      </div>
    </div>
  )
}

export default Riding
