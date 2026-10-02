import React from 'react'
import carImage from '../assets/car.png'
import autoImage from '../assets/auto.png'
import bikeImage from '../assets/bike.png'


const VehiclePanel = (props) => {
  return (
    <div>
        <h5 ref={props.vehiclePanelRef} onClick={() => props.setVehiclePanel?.(false)} className='absolute top-3 left-6 text-3xl'>
          <i className="ri-arrow-down-wide-line"></i>
        </h5>
        <h3 className='text-2xl font-semibold mb-3 text-center' >Choose a Vehicle</h3>
        <div onClick={() => {
            props.setConfirmedRidePanel(true)
        }} className='flex cursor-pointer border-2 border-white rounded-3xl mb-2 w-full p-3 items-center justify-between transition-colors active:border-emerald-950 focus:border-emerald-950 '>
          <img className='h-17' src={carImage} alt="Sabeel car" />
          <div className=' w-1/2 '>
            <h4 className='text-lg font-semibold'>SabeelOn <span><i className="ri-user-fill"></i>4</span></h4>
            <h5 className='font-medium text-gray-600'>3 mins away</h5>
            <p className='text-sm'>Affordable, compact rides</p>
          </div>
          <h2 className='text-xl font-semibold' >₹207.3</h2>
        </div>
        <div onClick={() => {
            props.setConfirmedRidePanel(true)
        }} className='flex cursor-pointer border-2 border-white rounded-3xl w-full p-3 items-center justify-between transition-colors active:border-emerald-950'>
          <img className='h-15' src={autoImage} alt="Sabeel auto" />
          <div className=' w-1/2 '>
            <h4 className='text-lg font-semibold'>Auto-Rikshaw <span><i className="ri-user-fill"></i>3</span></h4>
            <h5 className='font-medium text-gray-600'>21 mins away</h5>
            <p className='text-sm'>Affordable, Rikshaw rides</p>
          </div>
          <h2 className='text-xl font-semibold' >₹79.9</h2>
        </div>
        <div onClick={() => {
            props.setConfirmedRidePanel(true)
        }} className='flex cursor-pointer border-2 border-white rounded-3xl w-full p-3 items-center justify-between transition-colors active:border-emerald-950'>
          <img className='h-18' src={bikeImage} alt="Sabeel bike" />
          <div className=' w-1/2 '>
            <h4 className='text-lg font-semibold'>Mo-beel <span><i className="ri-user-fill"></i>1</span></h4>
            <h5 className='font-medium text-gray-600'>7 mins away</h5>
            <p className='text-sm'>Affordable, Quick Bike rides</p>
          </div>
          <h2 className='text-xl font-semibold' >₹101.1</h2>
        </div>
    </div>
  )
}

export default VehiclePanel