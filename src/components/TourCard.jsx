import "../styles/tourcard.css";

function TourCard({ tour }) {
  const difficultyLabel = (d) => {
    if (d <= 1) return { text: 'Fácil', color: '#22c55e' }
    if (d <= 3) return { text: 'Moderado', color: '#f59e0b' }
    return { text: 'Difícil', color: '#ef4444' }
  }

  const diff = difficultyLabel(tour.difficulty)

  return (
    <div className="tour-card">
      <div className="tour-card-img">
        {tour.thumbnailUrl
          ? <img src={tour.thumbnailUrl} alt={tour.slug} />
          : <div className="tour-card-placeholder"></div>
        }
        <span className="tour-badge" style={{ background: diff.color }}>
          {diff.text}
        </span>
        {tour.status === 'featured' && (
          <span className="tour-featured">Destacado</span>
        )}
      </div>
      <div className="tour-card-body">
        <span className="tour-category">{tour.category}</span>
        <h3 className="tour-title">{tour.slug?.replace(/-/g, ' ')}</h3>
        <div className="tour-meta">
          <span>{tour.durationDays ? `${tour.durationDays} días` : `${tour.durationHours}h`}</span>
          <span>{tour.minGroupSize}–{tour.maxGroupSize} pers.</span>
        </div>
        <div className="tour-footer">
          <span className="tour-price">${tour.pricePerPerson} <small>/ persona</small></span>
        </div>
      </div>
    </div>
  )
}

export default TourCard