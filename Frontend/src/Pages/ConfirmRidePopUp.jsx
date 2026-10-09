import { useState } from 'react'

const ConfirmRidePopUp = ({ ride, onStart, isStarting, error }) => {
  const [otp, setOtp] = useState('')

  const submitHandler = (event) => {
    event.preventDefault()
    onStart(otp)
  }

  if (!ride) return null
  return (
    <div className='relative'>
      <h3 className='mb-4 pt-4 text-center text-3xl font-semibold'>Verify and start the ride</h3>
      <p className='mb-3 text-center text-sm text-slate-600'>Ask the rider for their six-digit ride verification code.</p>
      <div className='mb-3 rounded-2xl bg-slate-50 p-3'>
        <p className='text-sm'><strong>Pickup:</strong> {ride.pickup.name}</p>
        <p className='mt-2 text-sm'><strong>Destination:</strong> {ride.destination.name}</p>
        <p className='mt-2 text-sm'><strong>Fare:</strong> ₹{ride.fare}</p>
      </div>
      <form onSubmit={submitHandler}>
        <label className='mb-2 block text-sm font-medium' htmlFor='ride-otp'>Rider’s verification code</label>
        <input
          id='ride-otp'
          inputMode='numeric'
          autoComplete='one-time-code'
          maxLength={6}
          pattern='[0-9]{6}'
          required
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder='Enter 6-digit code'
          className='mb-3 w-full rounded-2xl bg-gray-100 px-5 py-3 text-center text-2xl tracking-[0.5em]'
        />
        {error && <p role='alert' className='mb-3 text-sm text-red-700'>{error}</p>}
        <div className='flex gap-2'>
          <button type='submit' disabled={isStarting} className='w-full rounded-3xl bg-green-600 p-3 font-semibold text-white disabled:opacity-50'>
            {isStarting ? 'Starting…' : 'Start ride'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ConfirmRidePopUp
