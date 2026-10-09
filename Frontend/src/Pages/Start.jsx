import homeImage from '../assets/Sabeel-HomePage.png'
import {Link} from 'react-router-dom'

const Start = () => {
  return (
    <main className='start-page'>
      <div className='start-hero'>
        <img src={homeImage} alt='Riding...' className='start-art' />
      </div>
      <section className='start-panel'>
        <div className='start-content'>
          <h2>Get Started with Sabeel</h2>
          <div className='start-actions'>
            <Link to='/login' className='start-continue'>
              Continue
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Start