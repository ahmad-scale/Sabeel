import { useState } from 'react'
import { Link } from 'react-router-dom'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userData, setUserData] = useState({})


  const submitHandler = (e) => {
    e.preventDefault()

    setUserData({
      email: email,
      password: password,
      fullName: {
        firstName: firstName,
        lastName: lastName
      }
    })

    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
  }

  return (
    <div>
      <div className='p-7 flex flex-col justify-between h-screen'>
        <div>
          <h1 className='text-5xl text-emerald-950 mb-15 font-bold '>Sabeel</h1>

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
            <h3 className='text-xl mb-2 font-medium'>Enter your name</h3>
            <div className='flex gap-4 mb-5'>
              <input
                type="text"
                className='bg-[#eeeeee] rounded-l-4xl px-7 w-1/2 py-4 text-lg placeholder:text-md'
                required
                placeholder='First Name'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value) 
                }}
              />
              <input
                type="text"
                className='bg-[#eeeeee] rounded-r-4xl px-7 py-4 w-1/2 text-lg placeholder:text-md'
                placeholder='Last Name'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value) 
                }}
              />
            </div>

            <h3 className='text-xl mb-2 font-medium'>Login with your email</h3>
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

            <button className='bg-emerald-900 font-semibold text-white mb-7 rounded-4xl px-7 py-2 w-full text-lg placeholder:text-md' >Login</button>
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