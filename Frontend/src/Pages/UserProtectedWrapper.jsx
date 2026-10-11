import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import { API_BASE_URL, getStoredToken } from '../services/api'

const UserProtectedWrapper = ({ children }) => {
    const token = getStoredToken()
    const { setUser } = useContext(UserDataContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isUnauthorized, setIsUnauthorized] = useState(false)

    useEffect(() => {
        if (!token) return

        axios.get(`${API_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                const data = response.data
                setUser(data.user)
            }
        }).catch((error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                setIsUnauthorized(true)
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }, [token, setUser])

    if (!token || isUnauthorized) {
        return <Navigate to='/login' replace />
    }

    if (isLoading) {
        return(
            <div>Loading...</div>
        )
    }


    return <>{children}</>
}

export default UserProtectedWrapper