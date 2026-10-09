import homeImage from '../assets/Sabeel-HomePage.png'
import {Link} from 'react-router-dom'

const Start = () => {
  return (
    <div className='flex min-h-dvh w-full flex-col justify-between bg-emerald-900'>
        <img src={homeImage} alt="Riding..." className='h-[68svh] w-full flex-1 object-cover object-center sm:h-[76svh]' />
        <div className='rounded-t-3xl bg-white px-4 pt-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-6'>
            <h2 className='text-2xl font-bold sm:text-3xl'>Get Started with Sabeel</h2>
            <Link to='/login' className='flex justify-center items-center w-full bg-emerald-900 text-2xl text-white py-3 mt-5 rounded-3xl' >Continue</Link>
        </div>
    </div>
  )
}

export default Start