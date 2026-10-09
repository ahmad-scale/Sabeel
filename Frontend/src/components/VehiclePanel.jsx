import carImage from '../assets/car.png'
import autoImage from '../assets/auto.png'
import bikeImage from '../assets/bike.png'

const vehicles = [
  { type: 'car', name: 'SabeelOn', capacity: 4, image: carImage, description: 'Comfortable city rides' },
  { type: 'rikshaw', name: 'Auto-Rikshaw', capacity: 3, image: autoImage, description: 'Affordable local rides' },
  { type: 'bike', name: 'Mo-beel', capacity: 1, image: bikeImage, description: 'Quick solo rides' },
]

const VehiclePanel = ({ fares, selectedVehicle, onSelectVehicle, setConfirmedRidePanel, setVehiclePanel }) => (
  <div>
    <button
      type='button'
      onClick={() => setVehiclePanel(false)}
      className='absolute top-3 left-6 text-3xl'
      aria-label='Close vehicle selection'
    >
      <i className='ri-arrow-down-wide-line' />
    </button>
    <h3 className='mb-3 text-center text-2xl font-semibold'>Choose a Vehicle</h3>
    {vehicles.map((vehicle) => (
      <button
        key={vehicle.type}
        type='button'
        disabled={!fares}
        onClick={() => {
          onSelectVehicle(vehicle.type)
          setConfirmedRidePanel(true)
        }}
        className={`mb-2 flex w-full items-center justify-between rounded-3xl border-2 p-3 text-left transition-colors disabled:cursor-wait disabled:opacity-60 ${selectedVehicle === vehicle.type ? 'border-emerald-900 bg-emerald-50' : 'border-white hover:border-emerald-200'}`}
      >
        <img className='h-16 w-20 object-contain' src={vehicle.image} alt='' />
        <span className='w-1/2'>
          <span className='block text-lg font-semibold'>{vehicle.name} <i className='ri-user-fill' />{vehicle.capacity}</span>
          <span className='block text-sm text-gray-600'>{vehicle.description}</span>
        </span>
        <span className='text-xl font-semibold'>{fares ? `₹${fares[vehicle.type]}` : '…'}</span>
      </button>
    ))}
    {!fares && <p role='status' className='text-center text-sm text-slate-500'>Calculating route fares…</p>}
  </div>
)

export default VehiclePanel
