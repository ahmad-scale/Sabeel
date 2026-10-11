import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'
import { API_BASE_URL, getStoredToken } from '../services/api'

const CaptainProtectedWrapper = ({ children }) => {
    const token = getStoredToken()
    const { setCaptain } = useContext(CaptainDataContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isUnauthorized, setIsUnauthorized] = useState(false)

    useEffect(() => {
        if (!token) return

        axios.get(`${API_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                setCaptain(response.data.captain)
            }
        }).catch((error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                setIsUnauthorized(true)
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }, [token, setCaptain])

    if (!token || isUnauthorized) {
        return <Navigate to='/captain-login' replace />
    }

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return <>{children}</>
}

export default CaptainProtectedWrapper