import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CaptainLogout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const logoutCaptain = async () => {
      const token = localStorage.getItem('token')

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/captains/logout`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.status === 200) {
          localStorage.removeItem('token')
          navigate('/captain-login', { replace: true })
        }
      } catch (error) {
        console.error('Logout failed:', error)
        localStorage.removeItem('token')
        navigate('/captain-login', { replace: true })
      }
    }

    logoutCaptain()
  }, [navigate])

  return <div>Logging out...</div>
}

export default CaptainLogout