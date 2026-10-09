export const API_BASE_URL = (
  import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
).replace(/\/+$/, '')

export const getStoredToken = () => {
  const storedToken = localStorage.getItem('token')
  if (!storedToken?.startsWith('"') || !storedToken.endsWith('"')) return storedToken
  try {
    return JSON.parse(storedToken)
  } catch {
    return storedToken
  }
}

export const authHeaders = () => {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
