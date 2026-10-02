import React from 'react'
import carImage from '../assets/car.png'

const WaitingForDriver = ({ setWaitingForDriver }) => {
  return (
    <div>
      <div className='relative pt-10'>
        <button
        type='button'
        className='p-0 text-center w-[93%] absolute top-0 left-1/2 -translate-x-1/2'
        onClick={() => {
          setWaitingForDriver(false)
        }}
      >
        <i className='text-3xl ri-arrow-down-wide-line'></i>
      </button>

      <div className='flex items-center justify-between'>
        <img className='h-30' src={carImage} alt='Sabeel car' />
        <div className='text-right'>
          <h2 className='text-lg font-medium' >Kashif</h2>
          <h4 className='text-xl font-semibold -mt-1 -mb-2' >DL09 JK 6790</h4>
          <p className='text-medium text-gray-700'>Mahindra XUV300</p>
        </div>
      </div>


        <div className='flex gap-5 justify-between flex-col items-center'>
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
    </div>
  )
}

export default WaitingForDriver