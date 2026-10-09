import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'
import { API_BASE_URL } from '../services/api'

const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()


  const submitHandler = async (e) => {
    e.preventDefault()

    const captain = {
      email: email.trim().toLowerCase(),
      password: password
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/captains/login`, captain)

      if (response.status === 200) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }

      setEmail('')
      setPassword('')
      setError('')
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        'Unable to log in. Please check your credentials and try again.'
      )
    }
  }

  return (
    <div>
      <div className='mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-between p-5 sm:p-7'>
        <div>
          <h1 className='mb-10 text-4xl font-bold text-emerald-950 sm:mb-15 sm:text-5xl'>Sabeel <span className='ml-1 text-lg sm:text-xl'>Drivers</span></h1>

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>

            <h3 className='text-xl mb-2 font-medium'>Enter your phone number or email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-4xl px-7 py-4 w-full text-lg placeholder:text-md'
              required
              placeholder='email@example.com'
            />


            <h3 className='text-xl mb-2 font-medium' >Enter Password</h3>
            <input
              className='bg-[#eeeeee] mb-7 rounded-4xl px-7 py-4 w-full text-lg placeholder:text-md'
              type="password"
              required
              placeholder='Password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />

            {error && <p className='mb-5 text-red-600'>{error}</p>}

            <button className='bg-emerald-900 font-semibold text-white mb-7 rounded-4xl px-7 py-2 w-full text-lg placeholder:text-md' >Login</button>
          </form>
        </div>
        <div className='flex flex-col justify-between items-center'>
          <Link to='/captain-signup' className='mb-2'>Wanna join a fleet? <span className='text-emerald-500'>Register as a captain</span></Link>
          <Link to='/login' className='mt-1 flex w-full max-w-sm items-center justify-center rounded-4xl border border-emerald-900 px-4 py-2 text-center text-base font-semibold text-black sm:text-lg'>Sign In (User)</Link>
        </div>
      </div>
    </div>
  )
}

export default CaptainLogin