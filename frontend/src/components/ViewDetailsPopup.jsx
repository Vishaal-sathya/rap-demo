import React from 'react';
import './ViewDetailsPopup.css';

const ViewDetailsPopup = ({ train, searchParams, onClose, isCombinedRoute = false, legs = [] }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderDirectRoute = () => (
    <div className="journey-details-popup">
      <div className="route-overview">
        <div className="route-stations">
          <div className="station-info">
            <div className="station-name">{searchParams.source}</div>
            <div className="station-time">{formatTime(train.departure)}</div>
            <div className="station-date">{formatDate(train.departureDate)}</div>
          </div>
          <div className="route-line">
            <div className="line"></div>
            <div className="duration-info">{formatDuration(train.duration)}</div>
            <div className="line"></div>
          </div>
          <div className="station-info">
            <div className="station-name">{searchParams.destination}</div>
            <div className="station-time">{formatTime(train.arrival)}</div>
            <div className="station-date">{formatDate(train.arrivalDate)}</div>
          </div>
        </div>
      </div>
      
      <div className="journey-summary">
        <div className="summary-item">
          <span className="label">Distance</span>
          <span className="value">{train.distance} km</span>
        </div>
        <div className="summary-item">
          <span className="label">Duration</span>
          <span className="value">{formatDuration(train.duration)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Price</span>
          <span className="value price">{formatPrice(train.price)}</span>
        </div>
      </div>

      <div className="journey-tips">
        <h5>Journey Tips</h5>
        <ul>
          <li>Arrive at the station at least 30 minutes before departure</li>
          <li>Keep your tickets and ID ready during the journey</li>
          <li>Carry some snacks and water for the journey</li>
          <li>Check platform numbers on arrival at the station</li>
          <li>Keep your mobile phone charged for emergencies</li>
        </ul>
      </div>
    </div>
  );

  const renderCombinedRoute = () => (
    <div className="journey-details-popup combined">
      <div className="route-summary-header">
        <div className="total-overview">
          <div className="overview-item">
            <span className="overview-label">Total Journey</span>
            <span className="overview-value">{searchParams.source} → {searchParams.destination}</span>
          </div>
          <div className="overview-item">
            <span className="overview-label">Total Duration</span>
            <span className="overview-value">{formatDuration(train.duration)}</span>
          </div>
          <div className="overview-item">
            <span className="overview-label">Total Distance</span>
            <span className="overview-value">{train.distance} km</span>
          </div>
          <div className="overview-item">
            <span className="overview-label">Total Fare</span>
            <span className="overview-value price">{formatPrice(train.price)}</span>
          </div>
        </div>
      </div>

      <div className="combined-route-timeline">
        {legs.map((leg, index) => {
          const legDuration = Math.abs(
            new Date(`${leg.arrival_date}T${leg.arrival_time}`) - 
            new Date(`${leg.departure_date}T${leg.departure_time}`)
          ) / (1000 * 60);

          return (
            <div key={index} className="timeline-leg">
              <div className="leg-header-detailed">
                <div className="leg-number">Leg {index + 1}</div>
                <div className="leg-train-info">
                  <h4 className="train-name-detailed">{leg.train_name}</h4>
                  <span className="train-id-detailed">Train #{leg.train_id}</span>
                </div>
                <div className="leg-stats">
                  <div className="stat-item">
                    <span className="stat-label">Distance</span>
                    <span className="stat-value">{leg.distance_km} km</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Fare</span>
                    <span className="stat-value">{formatPrice(leg.price)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Duration</span>
                    <span className="stat-value">{formatDuration(legDuration)}</span>
                  </div>
                </div>
              </div>

              <div className="leg-journey-detailed">
                <div className="departure-info">
                  <div className="station-details">
                    <div className="station-name-large">{leg.from_station}</div>
                    <div className="station-label">Departure</div>
                  </div>
                  <div className="time-details">
                    <div className="time-large">{formatTime(leg.departure_time)}</div>
                    <div className="date-detailed">{formatDate(leg.departure_date)}</div>
                  </div>
                </div>

                <div className="journey-line-detailed">
                  <div className="line-segment"></div>
                  <div className="journey-icon">🚂</div>
                  <div className="line-segment"></div>
                </div>

                <div className="arrival-info">
                  <div className="station-details">
                    <div className="station-name-large">{leg.to_station}</div>
                    <div className="station-label">Arrival</div>
                  </div>
                  <div className="time-details">
                    <div className="time-large">{formatTime(leg.arrival_time)}</div>
                    <div className="date-detailed">{formatDate(leg.arrival_date)}</div>
                  </div>
                </div>
              </div>

              {index < legs.length - 1 && (
                <div className="connection-detailed">
                  <div className="connection-header">
                    <span className="connection-icon">🔄</span>
                    <span className="connection-title">Train Change</span>
                  </div>
                  <div className="connection-body">
                    <div className="connection-station">Change at {leg.to_station}</div>
                    <div className="connection-note">Please collect your luggage and proceed to the next train</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="journey-tips">
        <h5>Journey Tips</h5>
        <ul>
          <li>Arrive at the station at least 30 minutes before departure</li>
          <li>Keep your tickets and ID ready during the journey</li>
          <li>For train changes, allow sufficient time to move between platforms</li>
          <li>Check platform numbers before boarding</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3 className="popup-title">
            {isCombinedRoute ? 'Combined Route Details' : 'Journey Details'}
          </h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="popup-content">
          <div className="train-info-header">
            <h2 className="train-name">{train.name}</h2>
            {!isCombinedRoute && <p className="train-id">Train #{train.id}</p>}
          </div>
          
          {isCombinedRoute ? renderCombinedRoute() : renderDirectRoute()}
        </div>
        
        <div className="popup-footer">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsPopup;
