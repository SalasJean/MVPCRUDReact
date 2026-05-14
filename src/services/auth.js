//logeo
export const loginAdmin = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (response.status === 401) throw new Error('Credenciales incorrectas')
  if (!response.ok) throw new Error('Error al iniciar sesión')
  const data = await response.json()
  return data.access_token
}
//solo con perfil de admin
export const getAdminProfile = async (token) => {
  const response = await fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (response.status === 401) throw new Error('Token inválido o expirado')
  if (!response.ok) throw new Error('Error al obtener perfil')
  return response.json()
}