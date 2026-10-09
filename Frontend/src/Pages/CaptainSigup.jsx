import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../services/api'

const CaptainSignup = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userData, setUserData] = useState({})
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)


  const submitHandler = async (e) => {
    e.preventDefault()

    const captainData = {
      email: email,
      password: password,
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    }

    const response = await axios.post(`${API_BASE_URL}/captains/register`, captainData)

    if (response.status === 201) {
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')
    }

    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')
  }

  return (
    <div>
      <div className='mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-between p-5 sm:p-7'>
        <div>
          <h1 className='mb-10 text-4xl font-bold text-emerald-950 sm:mb-15 sm:text-5xl'>Sabeel <span className='ml-1 text-lg sm:text-xl'>Drivers</span></h1>

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

            <h3 className='text-xl mb-2 font-medium'>Enter your email address</h3>
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

            <h3 className='text-xl mb-2 font-medium'>Enter vehicle details</h3>
            <div className='border-2 border-emerald-900 bg-teal-900 rounded-4xl mb-5 p-1'>
              <input
                type="text"
                className='bg-[#eeeeee] mb-3 rounded-4xl px-7 py-4 w-full text-lg placeholder:text-md'
                required
                placeholder='Vehicle Color'
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
              />
              <input
                type="text"
                className='bg-[#eeeeee] mb-3 rounded-4xl px-7 py-4 w-full text-lg placeholder:text-md'
                required
                placeholder='Vehicle Plate'
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
              />
              <input
                type="number"
                min="1"
                className='bg-[#eeeeee] mb-3 rounded-4xl px-7 py-4 w-full text-lg placeholder:text-md'
                required
                placeholder='Vehicle Capacity'
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
              />
              <select
                className='bg-[#eeeeee] rounded-4xl px-7 py-4 w-full text-lg'
                required
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="" disabled>Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="rikshaw">Rikshaw</option>
                <option value="bike">Bike</option>
              </select>
            </div>

            <button className='bg-emerald-900 font-semibold text-white mb-7 rounded-4xl px-7 py-2 w-full text-lg placeholder:text-md' >Create A Captain Account</button>
          </form>
        </div>
        <div className='flex flex-col justify-between items-center'>
          <Link to='/login' className='mb-2'>Already have a account? <span className='text-emerald-500' >Login here</span></Link>
          <p className='text-gray-700 text-center tracking-tighter leading-3.75 text-xs'>This site is protected by reCAPTCHA and the <span className='text-blue-500'>Google Privacy Policy</span> <br /> and <span className='text-blue-500'>Terms of Service apply</span>Terms of Service apply</p>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup