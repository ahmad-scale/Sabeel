import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    const userData = {
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

    if (response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
      <div>
        <h1 className='text-5xl text-emerald-950 mb-15 font-bold' >Sabeel</h1>

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


          <button className='bg-emerald-900 font-semibold text-white mb-7 rounded-4xl px-7 py-2 w-full text-lg placeholder:text-md' >Login</button>
        </form>
      </div>
      <div className='flex flex-col justify-between items-center'>
        <Link to='/signup' className='mb-2'>New here? <span className='text-emerald-500' >Create New Account</span></Link>
        <Link to='/captain-login' className='font-semibold border flex items-center justify-center border-emerald-900 text-black  mt-1 rounded-4xl px-4 py-2 w-100 text-lg placeholder:text-md'>Sign In (Captain)</Link>
      </div>
    </div>
  )
}

export default UserLogin