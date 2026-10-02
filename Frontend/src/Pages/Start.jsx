import React from 'react'
import homeImage from '../assets/Sabeel-HomePage.png'
import {Link} from 'react-router-dom'

const Start = () => {
  return (
    <div className='flex bg-emerald-900 justify-between flex-col h-screen w-full'>
        <img src={homeImage} alt="Riding..." className='w-full h-screen overflow-hidden object-center object-cover' />
        <div className='pb-7 bg-white py-4 px-4 rounded-t-3xl'>
            <h2 className='text-3xl font-bold' >Get Started with Sabeel</h2>
            <Link to='/login' className='flex justify-center items-center w-full bg-emerald-900 text-2xl text-white py-3 mt-5 rounded-3xl' >Continue</Link>
        </div>
    </div>
  )
}

export default Start