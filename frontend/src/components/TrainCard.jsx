import React from 'react'

export default function TrainCard({ train, searchParams }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price)
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="train-card">
      {/* Train Header */}
      <div className="train-header">
        <div>
          <h3 className="train-name">{train.name}</h3>
          <p className="train-number">#{train.id}</p>
        </div>
        <div>
          <div className="train-price">
            {formatPrice(train.price)}
          </div>
          <p className="price-label">per person</p>
        </div>
      </div>

      {/* Journey Details */}
      <div className="journey-details">
        {/* Departure */}
        <div className="time-section">
          <div className="departure-time">{train.departure}</div>
          <div className="station-name">{searchParams.source}</div>
          <div className="date-info">{formatDate(searchParams.date)}</div>
        </div>

        {/* Duration & Distance */}
        <div className="duration-section">
          <div className="duration-line">
            <div className="line"></div>
            <div className="duration-badge">
              {formatDuration(train.duration)}
            </div>
            <div className="line"></div>
          </div>
          <div className="distance-info">{train.distance} km</div>
        </div>

        {/* Arrival */}
        <div className="time-section">
          <div className="arrival-time">{train.arrival}</div>
          <div className="station-name">{searchParams.destination}</div>
          <div className="date-info">
            {train.arrival < train.departure ? 'Next day' : 'Same day'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="train-actions">
        <button className="book-button">
          Book Now
        </button>
        <button className="details-button">
          View Details
        </button>
      </div>
    </div>
  )
}
  

