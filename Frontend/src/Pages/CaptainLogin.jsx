import { useState } from 'react'
import { Link } from 'react-router-dom'

const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captainData, setCaptainData] = useState({})


  const submitHandler = (e) => {
    e.preventDefault()

    setCaptainData({
      email: email,
      password: password
    })

    setEmail('')
    setPassword('')
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