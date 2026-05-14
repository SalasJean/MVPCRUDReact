
import '../styles/admintour.css'
function AdminTourRow({ tour, onEdit, onDelete }) {
  const statusColor = {
    published: '#22c55e',
    featured:  '#f59e0b',
    draft:     '#94a3b8'
  }

  return (
    <tr className="admin-row">
      <td>
        <span className="row-slug">{tour.slug}</span>
      </td>
      <td>{tour.category}</td>
      <td>
        {tour.durationDays ? `${tour.durationDays}d` : `${tour.durationHours}h`}
      </td>
      <td>${tour.pricePerPerson}</td>
      <td>
        <span
          className="status-badge"
          style={{ background: statusColor[tour.status] || '#94a3b8' }}
        >
          {tour.status}
        </span>
      </td>
      <td className="row-actions">
        <button
          className="btn-edit"
          onClick={() => onEdit(tour)}
          title="Editar"
        >
          Editar
        </button>
        <button
          className="btn-delete"
          onClick={() => {
            if (window.confirm(`¿Eliminar "${tour.slug}"?`)) onDelete(tour.id)
          }}
          title="Eliminar"
        >
          Eliminar
        </button>
      </td>
    </tr>
  )
}

export default AdminTourRow