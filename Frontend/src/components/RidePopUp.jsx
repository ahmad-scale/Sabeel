const RidePopUp = ({ ride, rider, onAccept, onIgnore, isAccepting }) => {
  if (!ride) return null
  return (
    <div className='relative'>
      <h3 className='mb-5 pt-4 text-center text-3xl font-semibold'>A Ride For You</h3>
      <div className='mb-3 flex items-center justify-between rounded-3xl border-2 border-amber-300 bg-gray-100 p-3'>
        <h2 className='text-xl font-medium'>{rider?.fullname?.firstname || 'Rider'} {rider?.fullname?.lastname || ''}</h2>
        <span className='rounded-3xl bg-amber-300 px-3 py-1 font-semibold'>{(ride.distanceMeters / 1000).toFixed(1)} km</span>
      </div>
      <div className='mb-3 flex items-center justify-between border-b p-3'>
        <span><i className='ri-map-pin-fill mr-2' aria-hidden='true' />Pickup</span>
        <strong className='max-w-[65%] text-right text-sm'>{ride.pickup.name}</strong>
      </div>
      <div className='mb-3 flex items-center justify-between border-b p-3'>
        <span><i className='ri-map-pin-user-fill mr-2' aria-hidden='true' />Drop-off</span>
        <strong className='max-w-[65%] text-right text-sm'>{ride.destination.name}</strong>
      </div>
      <div className='mb-4 flex justify-between p-3'>
        <span>Estimated fare</span><strong>₹{ride.fare}</strong>
      </div>
      <div className='flex gap-2'>
        <button type='button' disabled={isAccepting} onClick={onAccept} className='w-1/2 rounded-3xl bg-green-600 p-3 font-semibold text-white disabled:opacity-50'>
          {isAccepting ? 'Accepting…' : 'Accept ride'}
        </button>
        <button type='button' onClick={onIgnore} className='w-1/2 rounded-3xl bg-gray-200 p-3 font-semibold text-gray-900'>Ignore</button>
      </div>
    </div>
  )
}

export default RidePopUp
