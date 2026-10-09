import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from './ConfirmRidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import MapComponent from '../components/Map'
import { API_BASE_URL, authHeaders } from '../services/api'
import { useCaptainLocationPublisher } from '../services/liveTracking'

const CaptainHome = () => {
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
  const [acceptedRide, setAcceptedRide] = useState(null)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [rideError, setRideError] = useState('')
  const navigate = useNavigate()
  const { trackingStatus, trackingError, incomingRide, setIncomingRide, ignoreIncomingRide } = useCaptainLocationPublisher(true)
  const ridePopUpPanelRef = useRef(null)
  const confimrRidePopUpPanelRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    axios.get(`${API_BASE_URL}/rides/active`, {
      headers: authHeaders(),
      signal: controller.signal,
    }).then(({ data }) => {
      if (!data.ride) return
      if (data.ride.status === 'ongoing') {
        navigate(`/captain-riding/${data.ride._id}`, { replace: true, state: { ride: data.ride } })
        return
      }
      setAcceptedRide(data.ride)
      setConfirmRidePopUpPanel(true)
    }).catch((error) => {
      if (error.name !== 'CanceledError') {
        setRideError(error.response?.data?.message || 'Unable to restore your active ride.')
      }
    })
    return () => controller.abort()
  }, [navigate])

  useGSAP(function () {
    if (incomingRide) {
      gsap.to(ridePopUpPanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(ridePopUpPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [incomingRide])

  useGSAP(function () {
    if (confirmRidePopUpPanel) {
      gsap.to(confimrRidePopUpPanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confimrRidePopUpPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePopUpPanel])

  const acceptRide = async () => {
    if (!incomingRide?.ride?._id) return
    setIsAccepting(true)
    setRideError('')
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/rides/${incomingRide.ride._id}/accept`,
        {},
        { headers: authHeaders() }
      )
      setAcceptedRide(data.ride)
      setIncomingRide(null)
      setConfirmRidePopUpPanel(true)
    } catch (error) {
      setRideError(error.response?.data?.message || 'Unable to accept this ride.')
    } finally {
      setIsAccepting(false)
    }
  }

  const startRide = async (otp) => {
    if (!acceptedRide?._id) return
    setIsStarting(true)
    setRideError('')
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/rides/${acceptedRide._id}/start`,
        { otp },
        { headers: authHeaders() }
      )
      setConfirmRidePopUpPanel(false)
      navigate(`/captain-riding/${data.ride._id}`, { state: { ride: data.ride } })
    } catch (error) {
      setRideError(error.response?.data?.message || 'Unable to start this ride.')
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className='flex h-dvh flex-col overflow-hidden'>
      <div className='pointer-events-none fixed left-4 right-20 top-4 z-20 md:left-8'>
        <h1 className='m-0 text-4xl font-bold leading-tight text-emerald-950 drop-shadow-sm sm:text-5xl'>
          Sabeel <span className='text-xl font-bold sm:text-2xl'>Drivers</span>
        </h1>
      </div>
      <Link
        to='/captain-logout'
        aria-label='Log out'
        title='Log out'
        className='fixed right-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-700 bg-white text-emerald-950 shadow-lg'
      >
        <i className="text-2xl font-bold ri-logout-box-r-line"></i>
      </Link>
      <div className='min-h-0 flex-1'>
        <MapComponent showUserLocation />
      </div>
      <p role='status' className='px-4 pt-2 text-center text-xs text-emerald-900'>
        {trackingError || (trackingStatus === 'live' ? 'Online — sharing location and receiving nearby ride requests' : trackingStatus === 'locating' ? 'Online — waiting for GPS location' : 'Connecting to driver availability…')}
      </p>
      <div className='max-h-[38svh] shrink-0 overflow-y-auto rounded-t-3xl p-4 sm:p-6'>
        <CaptainDetails />
      </div>
      <div ref={ridePopUpPanelRef} className='fixed bottom-0 z-20 max-h-[85svh] w-full translate-y-full overflow-y-auto rounded-t-3xl border border-emerald-950 bg-white px-3 py-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:left-0 sm:right-0 sm:mx-auto sm:max-w-xl'>
        <RidePopUp
          ride={incomingRide?.ride}
          rider={incomingRide?.rider}
          onAccept={acceptRide}
          onIgnore={ignoreIncomingRide}
          isAccepting={isAccepting}
        />
        {rideError && !confirmRidePopUpPanel && <p role='alert' className='mt-2 text-sm text-red-700'>{rideError}</p>}
      </div>
      <div ref={confimrRidePopUpPanelRef} className='fixed bottom-0 z-20 max-h-[90svh] w-full translate-y-full overflow-y-auto rounded-t-3xl border border-emerald-950 bg-white px-3 py-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:left-0 sm:right-0 sm:mx-auto sm:max-w-xl'>
        <ConfirmRidePopUp
          ride={acceptedRide}
          onStart={startRide}
          isStarting={isStarting}
          error={rideError}
        />
      </div>
    </div>
  )
}

export default CaptainHome