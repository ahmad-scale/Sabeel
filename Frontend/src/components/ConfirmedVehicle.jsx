import carImage from '../assets/car.png'
import autoImage from '../assets/auto.png'
import bikeImage from '../assets/bike.png'

const vehicleImages = { car: carImage, rikshaw: autoImage, bike: bikeImage }
const formatDuration = (seconds) => {
  const minutes = Math.round(seconds / 60)
  const hours = Math.floor(minutes / 60)
  return hours ? `${hours} hr ${minutes % 60} min` : `${minutes} min`
}

const ConfirmedVehicle = ({
  pickup,
  destination,
  routeInfo,
  fare,
  vehicleType,
  isSubmitting,
  setConfirmedRidePanel,
  onConfirm,
}) => (
  <div className='relative'>
    <button
      type='button'
      className='absolute left-1/2 top-0 w-[93%] -translate-x-1/2 text-center'
      onClick={() => setConfirmedRidePanel(false)}
      aria-label='Close ride confirmation'
    >
      <i className='ri-arrow-down-wide-line text-3xl' />
    </button>
    <h3 className='mb-5 pt-8 text-center text-2xl font-semibold'>Confirm Your Ride</h3>
    <div className='flex flex-col items-center gap-5'>
      <img className='h-28 object-contain' src={vehicleImages[vehicleType]} alt='' />
      <div className='w-full'>
        <div className='mb-2 flex items-center gap-5 border-b p-3'>
          <i className='ri-map-pin-fill text-4xl' aria-hidden='true' />
          <div><h3 className='text-lg font-medium'>Pickup</h3><p className='text-sm text-gray-700'>{pickup?.name}</p></div>
        </div>
        <div className='mb-2 flex items-center gap-5 border-b p-3'>
          <i className='ri-map-pin-user-fill text-4xl' aria-hidden='true' />
          <div><h3 className='text-lg font-medium'>Destination</h3><p className='text-sm text-gray-700'>{destination?.name}</p></div>
        </div>
        <div className='flex items-center justify-between p-3'>
          <span>{routeInfo ? `${(routeInfo.distance / 1000).toFixed(1)} km · about ${formatDuration(routeInfo.duration)}` : 'Calculating route…'}</span>
          <strong>{Number.isFinite(fare) ? `₹${fare}` : '—'}</strong>
        </div>
      </div>
      <button
        type='button'
        disabled={isSubmitting || !routeInfo || !Number.isFinite(fare)}
        className='w-full rounded-3xl bg-green-600 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
        onClick={onConfirm}
      >
        {isSubmitting ? 'Requesting…' : 'Request ride'}
      </button>
    </div>
  </div>
)

export default ConfirmedVehicle
