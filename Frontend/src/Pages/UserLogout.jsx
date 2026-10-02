import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const logoutUser = async () => {
      const rawToken = localStorage.getItem('token')
      const token = rawToken?.startsWith('"') && rawToken.endsWith('"') ? JSON.parse(rawToken) : rawToken

      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.status === 200) {
          localStorage.removeItem('token')
          navigate('/login', { replace: true })
        }
      } catch (error) {
        console.error('Logout failed:', error)
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
      }
    }

    logoutUser()
  }, [navigate])

  return <div>Logging out...</div>
}

export default UserLogout