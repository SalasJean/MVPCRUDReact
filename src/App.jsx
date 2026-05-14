import { useState, useEffect } from 'react'

// Servicios
import { loginAdmin } from './services/auth'
import { getPublicTours, getAdminTours, createTour, updateTour, deleteTour } from './services/api'

import LoginForm    from './components/LoginForm'
import TourCard     from './components/TourCard'
import TourForm     from './components/TourForm'
import AdminTourRow from './components/AdminTourRow'

import './styles/App.css'

function App() {

  const [token, setToken]         = useState(() => localStorage.getItem('adminToken'))
  const [showLogin, setShowLogin] = useState(false)

  const [view, setView] = useState(token ? 'admin' : 'public')

  const [tours, setTours]           = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [editingTour, setEditingTour] = useState(null)

  const isAdmin = !!token

  useEffect(() => {
    if (view === 'admin' && token) {
      loadAdminTours()
    } else {
      loadPublicTours()
    }
  }, [view, token])

  const loadPublicTours = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPublicTours()
      const toursArray = Array.isArray(data) ? data : data.tours || data.data || []
      setTours(toursArray)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadAdminTours = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminTours(token)
      const toursArray = Array.isArray(data) ? data : data.tours || data.data || []
      setTours(toursArray)
    } catch (err) {
      setError(err.message)
      if (err.message.includes('No autorizado')) handleLogout()
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (email, password) => {
    const newToken = await loginAdmin(email, password)
    localStorage.setItem('adminToken', newToken)
    setToken(newToken)
    setShowLogin(false)
    setView('admin') 
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    setEditingTour(null)
    setView('public')  
  }

  const handleCreate = async (tourData) => {
    await createTour(tourData, token)
    await loadAdminTours()
  }

  const handleUpdate = async (id, tourData) => {
    await updateTour(id, tourData, token)
    await loadAdminTours()
    setEditingTour(null)
  }

  const handleDelete = async (id) => {
    await deleteTour(id, token)
    await loadAdminTours()
  }

  const renderPublic = () => (
    <section className="tours-section">
      <div className="section-header">
        <h2>Nuestros Tours</h2>
        <p>Descubre las maravillas de los Andes</p>
      </div>
      {loading && <div className="status-msg">Cargando tours...</div>}
      {error   && <div className="status-msg error">{error}</div>}
      {!loading && !error && tours.length === 0 && (
        <div className="status-msg">No hay tours disponibles por el momento.</div>
      )}
      <div className="tours-grid">
        {tours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  )

  const renderAdmin = () => (
    <section className="admin-section">
      <div className="section-header">
        <h2>Panel de Administración</h2>
        <p>Gestiona todos los tours desde aquí</p>
      </div>

      <TourForm
        editingTour={editingTour}
        onSave={editingTour ? handleUpdate : handleCreate}
        onCancel={() => setEditingTour(null)}
      />

      <div className="admin-table-wrap">
        <h3>Lista de Tours ({tours.length})</h3>
        {loading && <div className="status-msg">Cargando...</div>}
        {error   && <div className="status-msg error">{error}</div>}
        {!loading && tours.length === 0 && (
          <div className="status-msg">No hay tours aún. ¡Crea el primero!</div>
        )}
        {tours.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Categoría</th>
                <th>Duración</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tours.map(tour => (
                <AdminTourRow
                  key={tour.id}
                  tour={tour}
                  onEdit={setEditingTour}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon"></span>
          <div>
            <h1>Neon Andes Tours</h1>
            <p>Explora los Andes como nunca antes</p>
          </div>
        </div>

        <nav className="header-nav">
          <button
            className={`nav-btn ${view === 'public' ? 'active' : ''}`}
            onClick={() => setView('public')}
          >
            Tours
          </button>
          {isAdmin ? (
            <>
              <button
                className={`nav-btn ${view === 'admin' ? 'active' : ''}`}
                onClick={() => setView('admin')}
              >
                Panel Admin
              </button>
              <button className="nav-btn logout" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <button className="nav-btn login-btn" onClick={() => setShowLogin(true)}>
              Admin
            </button>
          )}
        </nav>
      </header>
      <main className="app-main">
        {view === 'public' ? renderPublic() : renderAdmin()}
      </main>
      {showLogin && (
        <LoginForm
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  )
}

export default App