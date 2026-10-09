import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'
import { API_BASE_URL, authHeaders } from '../services/api'

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    axios.get(`${API_BASE_URL}/rides/captain/stats`, {
      headers: authHeaders(),
      signal: controller.signal,
    }).then(({ data }) => setStats(data))
      .catch((requestError) => {
        if (requestError.name !== 'CanceledError') {
          setError(requestError.response?.data?.message || 'Unable to load captain statistics.')
        }
      })
    return () => controller.abort()
  }, [])

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h4 className='text-lg font-medium'>{captain?.fullname?.firstname || 'Captain'} {captain?.fullname?.lastname || ''}</h4>
        <div className='text-right'>
          <h4 className='text-xl font-semibold'>₹{stats ? Math.round(stats.earnings).toLocaleString('en-IN') : '—'}</h4>
          <p className='-mt-2 text-sm text-gray-700'>Completed-trip earnings</p>
        </div>
      </div>
      <div className='mt-5 flex justify-around rounded-3xl bg-gray-100 p-4'>
        <div className='text-center'>
          <i className='ri-roadster-line mb-2 text-3xl' aria-hidden='true' />
          <h5 className='text-xl font-semibold'>{stats?.completedRides ?? '—'}</h5>
          <p className='text-sm text-gray-700'>Completed trips</p>
        </div>
        <div className='text-center'>
          <i className='ri-route-line mb-2 text-3xl' aria-hidden='true' />
          <h5 className='text-xl font-semibold'>{stats ? stats.distanceKm.toFixed(1) : '—'}</h5>
          <p className='text-sm text-gray-700'>Kilometers driven</p>
        </div>
      </div>
      {error && <p role='status' className='mt-2 text-sm text-red-700'>{error}</p>}
    </div>
  )
}

export default CaptainDetails
