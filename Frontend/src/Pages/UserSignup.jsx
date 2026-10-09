import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import { API_BASE_URL } from '../services/api'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const navigate = useNavigate()

  const { setUser } = React.useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()

    const newUser = {
      email: email,
      password: password,
      fullname: {
        firstname: firstName,
        lastname: lastName
      }
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, newUser)

      if (response.status === 201) {
        const user = response.data.user
        setUser(user)
        localStorage.setItem('token', response.data.token)
        navigate('/home')
      }

      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
    } catch (error) {
      console.error('User registration failed:', error)
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.'

      alert(message)
    }
  }

  return (
    <div>
      <div className='mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-between p-5 sm:p-7'>
        <div>
          <h1 className='mb-10 text-4xl font-bold text-emerald-950 sm:mb-15 sm:text-5xl'>Sabeel</h1>

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
            <h3 className='text-xl mb-2 font-medium'>Enter your name</h3>
            <div className='mb-5 flex gap-2 sm:gap-4'>
              <input
                type="text"
                className='min-w-0 w-1/2 rounded-l-4xl bg-[#eeeeee] px-3 py-4 text-base sm:px-7 sm:text-lg'
                required
                placeholder='First Name'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
              />
              <input
                type="text"
                className='min-w-0 w-1/2 rounded-r-4xl bg-[#eeeeee] px-3 py-4 text-base sm:px-7 sm:text-lg'
                placeholder='Last Name'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
              />
            </div>

            <h3 className='text-xl mb-2 font-medium'>Email your email address</h3>
            <input
              type="email"
              className='bg-[#eeeeee] mb-5 rounded-4xl px-7 py-4 w-full text-lg placeholder:text-md'
              required
              placeholder='email@example.com'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />

            <h3 className='text-xl mb-2 font-medium' >Enter Password</h3>
            <input
              className='bg-[#eeeeee] mb-5 rounded-4xl px-7 py-4 w-full text-lg placeholder:text-md'
              type="password"
              required
              placeholder='Password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />

            <button className='bg-emerald-900 font-semibold text-white mb-7 rounded-4xl px-7 py-2 w-full text-lg placeholder:text-md' >Create Account</button>
          </form>
        </div>
        <div className='flex flex-col justify-between items-center'>
          <Link to='/login' className='mb-2'>Already have a account? <span className='text-emerald-500' >Login here</span></Link>
          <p className='text-gray-700 text-center tracking-tighter leading-3.75 text-xs '>By proceeding, you consent to get email messages, including by automated means, from Sabeel and its affiliates to the email provided</p>
        </div>
      </div>
    </div>
  )
}

export default UserSignup