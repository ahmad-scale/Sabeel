import carImage from '../assets/car.png'
import Loader from './Loader'

const LookingForDriver = ({ ride, onCancel }) => (
  <div className='relative'>
    <Loader />
    <h3 className='mb-2 pt-8 text-center text-2xl font-semibold'>Looking For A Driver</h3>
    <p className='mb-4 text-center text-sm text-slate-600'>
      {ride?.nearbyCaptains === 0
        ? 'No nearby drivers are connected yet. Your request is still available to drivers who come online.'
        : 'Your request has been sent to nearby drivers.'}
    </p>
    <div className='flex flex-col items-center gap-4'>
      <img className='h-24 object-contain' src={carImage} alt='' />
      <div className='w-full'>
        <div className='mb-2 flex items-center gap-5 border-b p-3'>
          <i className='ri-map-pin-fill text-3xl' aria-hidden='true' />
          <div><h3 className='font-medium'>Pickup</h3><p className='text-sm text-gray-700'>{ride?.pickup?.name}</p></div>
        </div>
        <div className='mb-2 flex items-center gap-5 border-b p-3'>
          <i className='ri-map-pin-user-fill text-3xl' aria-hidden='true' />
          <div><h3 className='font-medium'>Destination</h3><p className='text-sm text-gray-700'>{ride?.destination?.name}</p></div>
        </div>
        <div className='flex items-center justify-between p-3'>
          <span className='font-semibold'>Ride verification code</span>
          <strong className='rounded-lg bg-emerald-50 px-3 py-1 text-lg tracking-widest'>{ride?.otp}</strong>
        </div>
        <p className='px-3 text-xs text-slate-500'>Share this code with your driver when they arrive.</p>
      </div>
      <button type='button' onClick={onCancel} className='w-full rounded-3xl bg-slate-200 p-3 font-semibold text-slate-900'>
        Cancel request
      </button>
    </div>
  </div>
)

export default LookingForDriver
