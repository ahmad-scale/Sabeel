import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

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
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8000'
      const response = await axios.post(`${baseUrl}/captains/login`, captain)

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
      <div className='p-7 flex flex-col justify-between h-screen'>
        <div>
          <h1 className='text-5xl text-emerald-950 mb-15 font-bold ' >Sabeel</h1>

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
          <Link to='/login' className='font-semibold border flex items-center justify-center border-emerald-900 text-black mb-3 mt-1 rounded-4xl px-4 py-2 w-100 text-lg placeholder:text-md'>Sign In (User)</Link>
        </div>
      </div>
    </div>
  )
}

export default CaptainLogin