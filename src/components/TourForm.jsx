import '../styles/tourform.css'
import { useState, useEffect } from 'react'

const EMPTY = {
  slug: '',
  category: 'cultural',
  durationDays: '',
  durationHours: '',
  difficulty: 3,
  minGroupSize: 2,
  maxGroupSize: 12,
  pricePerPerson: '',
  thumbnailUrl: '',
  status: 'published'
}

function TourForm({ editingTour, onSave, onCancel }) {
  const [form, setForm]     = useState(EMPTY)
  const [error, setError]   = useState('')
  const [saving, setSaving] = useState(false)

  // Editar tour con placehorlder -> recuerda que el react +18 nos marcarra erro 
  useEffect(() => {
    if (editingTour) {
      setForm({
        slug:          editingTour.slug          || '',
        category:      editingTour.category      || 'cultural',
        durationDays:  editingTour.durationDays  || '',
        durationHours: editingTour.durationHours || '',
        difficulty:    editingTour.difficulty    || 3,
        minGroupSize:  editingTour.minGroupSize  || 2,
        maxGroupSize:  editingTour.maxGroupSize  || 12,
        pricePerPerson: editingTour.pricePerPerson || '',
        thumbnailUrl:  editingTour.thumbnailUrl  || '',
        status:        editingTour.status        || 'published'
      })
    } else {
      setForm(EMPTY)
    }
  }, [editingTour])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      ...form,
      durationDays:   form.durationDays  ? Number(form.durationDays)  : null,
      durationHours:  form.durationHours ? Number(form.durationHours) : null,
      difficulty:     Number(form.difficulty),
      minGroupSize:   Number(form.minGroupSize),
      maxGroupSize:   Number(form.maxGroupSize),
      pricePerPerson: Number(form.pricePerPerson),
    }

    try {
      if (editingTour) {
        await onSave(editingTour.id, payload)
      } else {
        await onSave(payload)
      }
      setForm(EMPTY)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="tour-form" onSubmit={handleSubmit}>
      <h3>{editingTour ? 'Editar Tour' : 'Nuevo Tour'}</h3>

      <div className="form-grid">
        <div className="field full">
          <label>Slug (identificador único)</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="tour-machu-picchu-clasico"
            required
          />
        </div>

        <div className="field">
          <label>Categoría</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="cultural">Cultural</option>
            <option value="adventure">Aventura</option>
            <option value="nature">Naturaleza</option>
            <option value="gastronomy">Gastronomía</option>
          </select>
        </div>

        <div className="field">
          <label>Estado</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="published">Publicado</option>
            <option value="featured">Destacado</option>
            <option value="draft">Borrador</option>
          </select>
        </div>

        <div className="field">
          <label>Duración (días)</label>
          <input
            type="number"
            name="durationDays"
            value={form.durationDays}
            onChange={handleChange}
            placeholder="3"
            min="1"
          />
        </div>

        <div className="field">
          <label>Duración (horas)</label>
          <input
            type="number"
            name="durationHours"
            value={form.durationHours}
            onChange={handleChange}
            placeholder="8"
            min="1"
          />
        </div>

        <div className="field">
          <label>Dificultad (1–5)</label>
          <input
            type="number"
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />
        </div>

        <div className="field">
          <label>Precio por persona ($)</label>
          <input
            type="number"
            name="pricePerPerson"
            value={form.pricePerPerson}
            onChange={handleChange}
            placeholder="280"
            min="0"
            required
          />
        </div>

        <div className="field">
          <label>Mín. personas</label>
          <input
            type="number"
            name="minGroupSize"
            value={form.minGroupSize}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="field">
          <label>Máx. personas</label>
          <input
            type="number"
            name="maxGroupSize"
            value={form.maxGroupSize}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="field full">
          <label>URL de imagen (thumbnail)</label>
          <input
            name="thumbnailUrl"
            value={form.thumbnailUrl}
            onChange={handleChange}
            placeholder="https://imgs.travel.pe/tours/machu.jpg"
          />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Guardando...' : editingTour ? 'Actualizar' : 'Crear Tour'}
        </button>
        {editingTour && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default TourForm