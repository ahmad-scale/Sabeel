import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'
import { API_BASE_URL } from '../services/api'

const CaptainProtectedWrapper = ({ children }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { setCaptain } = useContext(CaptainDataContext)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/captain-login', { replace: true })
            return
        }

        axios.get(`${API_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                setCaptain(response.data.captain)
            }
        }).catch(() => {
            localStorage.removeItem('token')
            navigate('/captain-login', { replace: true })
        }).finally(() => {
            setIsLoading(false)
        })
    }, [token, navigate, setCaptain])

    if(isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return <>{children}</>
}

export default CaptainProtectedWrapper