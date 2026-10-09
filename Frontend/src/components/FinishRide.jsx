const FinishRide = ({ ride, onFinish, isFinishing, error }) => (
  <div className='relative'>
    <h3 className='mb-5 pt-4 text-center text-3xl font-semibold'>Complete this ride</h3>
    <div className='mb-4 rounded-2xl bg-slate-50 p-4'>
      <p className='text-sm'><strong>Pickup:</strong> {ride?.pickup?.name}</p>
      <p className='mt-2 text-sm'><strong>Destination:</strong> {ride?.destination?.name}</p>
      <p className='mt-3 flex justify-between border-t pt-3'><span>Fare due</span><strong>₹{ride?.fare}</strong></p>
    </div>
    {error && <p role='alert' className='mb-3 text-sm text-red-700'>{error}</p>}
    <button
      type='button'
      disabled={isFinishing}
      onClick={onFinish}
      className='w-full rounded-3xl bg-green-600 p-3 font-semibold text-white disabled:opacity-50'
    >
      {isFinishing ? 'Completing…' : 'Complete ride'}
    </button>
    <p className='mt-2 text-center text-xs text-slate-500'>Mark complete only after reaching the destination and collecting payment.</p>
  </div>
)

export default FinishRide
