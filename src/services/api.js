//meotodo publico
export const getPublicTours = async () => {
  const response = await fetch('/api/tours')
  if (!response.ok) throw new Error('Error al cargar los tours')
  return response.json()
}

// solo administrador
export const getAdminTours = async (token) => {
  const response = await fetch('/api/admin/tours', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (response.status === 401) throw new Error('No autorizado. Inicia sesión nuevamente.')
  if (!response.ok) throw new Error('Error al cargar tours')
  return response.json()
}

export const createTour = async (tourData, token) => {
  const response = await fetch('/api/admin/tours', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(tourData)
  })
  if (response.status === 401) throw new Error('No autorizado. Inicia sesión nuevamente.')
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Error al crear el tour')
  }
  return response.json()
}

export const updateTour = async (id, tourData, token) => {
  const response = await fetch(`/api/admin/tours/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(tourData)
  })
  if (response.status === 401) throw new Error('No autorizado. Inicia sesión nuevamente.')
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Error al actualizar el tour')
  }
  return response.json()
}

export const deleteTour = async (id, token) => {
  const response = await fetch(`/api/admin/tours/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (response.status === 401) throw new Error('No autorizado. Inicia sesión nuevamente.')
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Error al eliminar el tour')
  }
  return true
}