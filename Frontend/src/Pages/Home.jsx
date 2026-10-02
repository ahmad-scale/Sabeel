import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmedVehicle from '../components/ConfirmedVehicle'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const confirmedRidePanelRef = useRef(null)
  const panelCloseRef = useRef(null)
  const waitingForDriverRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmedRidePanel, setConfirmedRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  

  const submitHandler = (e) => {
    e.preventDefault()
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

  useGSAP(function () {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [waitingForDriver])


  return (
    <div className='fixed inset-0 h-screen w-full overflow-hidden'>

      <div onClick={() => { setVehiclePanel(false) }} className='fixed inset-0 z-0 h-screen w-full overflow-hidden bg-slate-200'>
        {/* image for temporary use  */}
        <img className='absolute inset-0 block h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Sabeel ride background" />
        <div className='absolute inset-0 flex flex-col justify-start px-6 pt-8 md:px-12 lg:px-20'>
          <h1 className='m-0 inline-block pb-6 text-5xl font-bold text-emerald-950'>Sabeel</h1>
        </div>

      </div>
      <div className='fixed inset-0 z-10 flex h-screen w-full flex-col justify-end overflow-hidden'>
        <div className=' h-[25%] p-6 bg-white relative '>
          <h5 ref={panelCloseRef} onClick={() => { setPanelOpen(false) }} className=' opacity-0 absolute top-5 left-5 text-3xl'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='text-3xl font-semibold text-center text-emerald-950'>Find a trip</h4>
          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
            <div className="line absolute h-20 w-1.5 rounded-full top-[45%] left-10 bg-teal-800"></div>
            <input onClick={() => setPanelOpen(true)} value={pickup} onChange={(e) => { setPickup(e.target.value) }} className='bg-[#eee] px-12 py-4 text-xl rounded-t-3xl w-full mb-3 mt-5' type="text" placeholder='Add a pick-up location' />
            <input onClick={() => setPanelOpen(true)} value={destination} onChange={(e) => { setDestination(e.target.value) }} className='bg-[#eee] px-12 py-4 text-xl rounded-b-3xl w-full' type="text" placeholder='Enter your destination' />
          </form>
        </div>
        <div ref={panelRef} className='h-0 overflow-hidden bg-white'>
          <LocationSearchPanel setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel} />
        </div>
      </div>
      <div ref={vehiclePanelRef} className='fixed rounded-t-3xl border border-emerald-950 w-full z-20 bottom-0 bg-white pt-3 px-3 py-8 translate-y-full '>
        <VehiclePanel setConfirmedRidePanel={setConfirmedRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>
      <div ref={confirmedRidePanelRef} className='fixed rounded-t-3xl border border-emerald-950 w-full z-20 bottom-0 bg-white px-3 py-6 pt-3 translate-y-full '>
        <ConfirmedVehicle setConfirmedRidePanel={setConfirmedRidePanel} setVehicleFound={setVehicleFound} setVehiclePanel={setVehiclePanel}/>
      </div>
      <div ref={vehicleFoundRef} className='fixed rounded-t-3xl border border-emerald-950 w-full z-20 bottom-0 bg-white px-3 py-6 pt-3 translate-y-full '>
          <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>
      <div ref={waitingForDriverRef} className='fixed rounded-t-3xl border border-emerald-950 w-full z-20 bottom-0 bg-white px-3 py-6 pt-3  '>
          <WaitingForDriver setWaitingForDriver={setWaitingForDriver}/>
      </div>
    </div>
  )
}

export default Home