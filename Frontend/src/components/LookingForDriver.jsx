import React from 'react'
import carImage from '../assets/car.png'
import Loader from './Loader'

const LookingForDriver = (props) => {
  return (
    <div className='relative'>
      <button
        type='button'
        className='p-0 text-left w-[93%] absolute top-0 left-1/2 -translate-x-1/2'
        onClick={() => {
          props.setVehicleFound(false)
        }}
      >
        <i className='text-3xl ri-arrow-down-wide-line'></i>
      </button>

      <Loader/>


      <h3 className='pt-8 text-2xl font-semibold mb-5 text-center'>Looking For A Driver</h3>
      <div className='flex gap-5 justify-between flex-col items-center'>
        <img className='h-30' src={carImage} alt='Sabeel car' />

        <div className='w-full '>
          <div className='mb-2 flex items-center gap-5 p-3 border-b'>
            <i className=" text-4xl ri-map-pin-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>562/11-D</h3>
              <p className='text-medium -mt-1 text-gray-700'>Badarpur, New Delhi</p>
            </div>
          </div>
          <div className='mb-2 flex items-center gap-5 p-3 border-b'>
            <i className=" text-4xl ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>562/11-D</h3>
              <p className='text-medium -mt-1 text-gray-700'>Badarpur, New Delhi</p>
            </div>
          </div>
          <div className='mb-2 flex items-center gap-5 p-3'>
            <i className=" text-4xl ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>₹ 112.3</h3>
              <p className='text-medium -mt-1 text-gray-700'>Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LookingForDriver