import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserProtectedWrapper = ({ children }) => {
    const rawToken = localStorage.getItem('token')
    const token = rawToken?.startsWith('"') && rawToken.endsWith('"') ? JSON.parse(rawToken) : rawToken
    const navigate = useNavigate()
    const { setUser } = useContext(UserDataContext)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true })
            return
        }

    }, [token, navigate])

    useEffect(() => {
        if (!token) return

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                const data = response.data
                setUser(data.user)
            }
        }).catch(() => {
            localStorage.removeItem('token')
            navigate('/login', { replace: true })
        }).finally(() => {
            setIsLoading(false)
        })
    }, [token, navigate, setUser])

    if(isLoading) {
        return(
            <div>Loading...</div>
        )
    }


    return <>{children}</>
}

export default UserProtectedWrapper