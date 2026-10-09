import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import FinishRide from '../components/FinishRide'
import MapComponent from '../components/Map'
import { useCaptainLocationPublisher } from '../services/liveTracking'
import { API_BASE_URL, authHeaders } from '../services/api'

const CaptainRiding = () => {
  const { rideId } = useParams()
  const route = useLocation()
  const navigate = useNavigate()
  const [ride, setRide] = useState(route.state?.ride || null)
  const [finishRidePanel, setFinishRidePanel] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const [rideError, setRideError] = useState('')
  const { trackingStatus, trackingError } = useCaptainLocationPublisher(true)
  const finishRideRef = useRef(null)

  useEffect(() => {
    if (ride || !rideId) return undefined
    const controller = new AbortController()
    axios.get(`${API_BASE_URL}/rides/${rideId}`, {
      headers: authHeaders(),
      signal: controller.signal,
    }).then(({ data }) => setRide(data.ride))
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          setRideError(error.response?.data?.message || 'Unable to load this ride.')
        }
      })
    return () => controller.abort()
  }, [rideId, ride])

  useGSAP(() => {
    gsap.to(finishRideRef.current, {
      transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)'
    })
  }, [finishRidePanel])

  const finishRide = async () => {
    if (!ride?._id) return
    setIsFinishing(true)
    setRideError('')
    try {
      await axios.post(`${API_BASE_URL}/rides/${ride._id}/complete`, {}, {
        headers: authHeaders(),
      })
      navigate('/captain-home', { replace: true })
    } catch (error) {
      setRideError(error.response?.data?.message || 'Unable to complete this ride.')
    } finally {
      setIsFinishing(false)
    }
  }

  return (
    <div className='flex h-dvh flex-col overflow-hidden md:flex-row'>
      <div className='pointer-events-none absolute inset-0 z-10 flex flex-col justify-start px-6 pt-8 md:px-12'>
        <h1 className='m-0 text-5xl font-bold text-emerald-950'>Sabeel <span className='text-xl'>Drivers</span></h1>
      </div>
      <Link to='/captain-home' className='fixed right-2 top-7 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-700 bg-white' aria-label='Back to captain home'>
        <i className='ri-home-5-line text-2xl' />
      </Link>
      <div className='min-h-[46svh] min-w-0 flex-1 md:min-h-0'>
        <MapComponent pickup={ride?.pickup?.coordinates} destination={ride?.destination?.coordinates} showUserLocation />
      </div>
      <div className='flex w-full shrink-0 flex-col items-center justify-center rounded-t-3xl bg-amber-400 p-4 md:h-full md:w-[min(28rem,40vw)] md:rounded-none'>
        <p className='mb-2 text-center text-xs font-semibold text-emerald-950' role='status'>
          {trackingError || (trackingStatus === 'live' ? 'Sharing live location with rider' : trackingStatus === 'locating' ? 'Waiting for GPS location…' : 'Connecting live tracking…')}
        </p>
        <h2 className='mb-3 text-center text-lg font-semibold'>{ride?.destination?.name || 'Loading ride…'}</h2>
        {rideError && <p role='alert' className='mb-2 text-sm text-red-800'>{rideError}</p>}
        <button
          type='button'
          disabled={!ride || ride.status !== 'ongoing'}
          onClick={() => setFinishRidePanel(true)}
          className='w-full rounded-3xl bg-emerald-900 p-3 text-lg font-semibold text-white disabled:opacity-50'
        >
          Complete ride · ₹{ride?.fare ?? '—'}
        </button>
      </div>
      <div ref={finishRideRef} style={{ transform: 'translateY(100%)' }} className='fixed bottom-0 z-20 max-h-[90svh] w-full overflow-y-auto rounded-t-3xl border border-emerald-950 bg-white px-3 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:left-0 sm:right-0 sm:mx-auto sm:max-w-xl'>
        <FinishRide ride={ride} onFinish={finishRide} isFinishing={isFinishing} error={rideError} />
      </div>
    </div>
  )
}

export default CaptainRiding
