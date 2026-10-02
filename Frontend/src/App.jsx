import React from 'react'
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

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<CaptainLogin />} />
        <Route path='/captain-signup' element={<CaptainSigup />} />
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