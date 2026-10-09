import { Routes, Route } from 'react-router-dom'
import Start from './Pages/Start'
import UserLogin from './Pages/UserLogin'
import UserSignup from './Pages/UserSignup'
import CaptainLogin from './Pages/CaptainLogin'
import CaptainSigup from './Pages/CaptainSigup'
import Home from './Pages/Home'
import UserProtectedWrapper from './Pages/UserProtectedWrapper'
import UserLogout from './Pages/UserLogout'
import CaptainHome from './Pages/CaptainHome'
import CaptainProtectedWrapper from './Pages/CaptainProtectWrapper'
import CaptainLogout from './Pages/CaptainLogout'
import Riding from './Pages/Riding'
import CaptainRiding from './Pages/CaptainRiding'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<CaptainLogin />} />
        <Route path='/captain-signup' element={<CaptainSigup />} />
        <Route path='/riding' element={<UserProtectedWrapper><Riding /></UserProtectedWrapper>} />
        <Route path='/riding/:rideId' element={<UserProtectedWrapper><Riding /></UserProtectedWrapper>} />
        <Route path='/captain-riding' element={<CaptainProtectedWrapper><CaptainRiding /></CaptainProtectedWrapper>} />
        <Route path='/captain-riding/:rideId' element={<CaptainProtectedWrapper><CaptainRiding /></CaptainProtectedWrapper>} />
        <Route path='/home'
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />
        <Route path='/users/logout'
          element={
            <UserProtectedWrapper>
              <UserLogout />
            </UserProtectedWrapper>
          }
        />
        <Route path='/captain-home'
          element={
            <CaptainProtectedWrapper>
              <CaptainHome />
            </CaptainProtectedWrapper>
          }
        />
        <Route path='/captain-logout'
          element={
            <CaptainProtectedWrapper>
              <CaptainLogout />
            </CaptainProtectedWrapper>
          }
        />
      </Routes>
    </div>
  )
}

export default App