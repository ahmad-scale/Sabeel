import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../services/api'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const userData = {
      email: email.trim().toLowerCase(),
      password: password
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, userData)

      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')

      setEmail('')
      setPassword('')
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        requestError.response?.data?.errors?.[0]?.msg ||
        'Unable to reach the server. Check your connection and try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-between p-5 sm:p-7'>
      <div>
        <h1 className='mb-10 text-4xl font-bold text-emerald-950 sm:mb-15 sm:text-5xl'>Sabeel</h1>

        <form onSubmit={submitHandler}>

          <h3 className='text-xl mb-2 font-medium'>Enter your phone number or email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setError('')
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
              setError('')
              setPassword(e.target.value)
            }}
          />

          {error && <p role='alert' className='mb-5 text-red-700'>{error}</p>}

          <button
            disabled={isSubmitting}
            className='bg-emerald-900 font-semibold text-white mb-7 rounded-4xl px-7 py-2 w-full text-lg placeholder:text-md disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isSubmitting ? 'Signing in…' : 'Login'}
          </button>
        </form>
      </div>
      <div className='flex flex-col justify-between items-center'>
        <Link to='/signup' className='mb-2'>New here? <span className='text-emerald-500' >Create New Account</span></Link>
        <Link to='/captain-login' className='mt-1 flex w-full max-w-sm items-center justify-center rounded-4xl border border-emerald-900 px-4 py-2 text-center text-base font-semibold text-black sm:text-lg'>Sign In (Captain)</Link>
      </div>
    </div>
  )
}

export default UserLogin