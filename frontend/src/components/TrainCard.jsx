import React, { useState } from "react";
import BookingPopup from "./BookingPopup"; 
import ViewDetailsPopup from "./ViewDetailsPopup";

export default function TrainCard({ train, searchParams, isCombinedRoute = false, legs = [] }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

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
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const handleBookNowClick = () => {
    setShowPopup(true);
  };

  const handleConfirm = (email) => {
    // Send OTP logic here
    console.log("Send OTP to:", email);
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleViewDetailsClick = () => {
    setShowDetailsPopup(true);
  };

  const handleCloseDetailsPopup = () => {
    setShowDetailsPopup(false);
  };

  const renderDirectRoute = () => (
    <div className="journey-details">
      <div className="time-section">
        <div className="departure-time">{train.departure}</div>
        <div className="station-name">{searchParams.source}</div>
        <div className="date-info">{formatDate(searchParams.date)}</div>
      </div>

      <div className="duration-section">
        <div className="duration-line">
          <div className="line"></div>
          <div className="duration-badge">{formatDuration(train.duration)}</div>
          <div className="line"></div>
        </div>
        <div className="distance-info">{train.distance} km</div>
      </div>

      <div className="time-section">
        <div className="arrival-time">{train.arrival}</div>
        <div className="station-name">{searchParams.destination}</div>
        <div className="date-info">
          {train.arrival < train.departure ? "Next day" : "Same day"}
        </div>
      </div>
    </div>
  );

  const renderCombinedRoute = () => (
    <div className="combined-journey-details">
      {legs.map((leg, index) => (
        <div key={index} className="leg-section">
          <div className="leg-header">
            <span className="leg-train-name">{leg.train_name || leg.train_id}</span>
            <span className="leg-distance">{leg.distance_km} km</span>
            <span className="leg-price">{formatPrice(leg.price)}</span>
          </div>
          
          <div className="leg-journey">
            <div className="leg-time-section">
              <div className="departure-time">{leg.departure_time}</div>
              <div className="station-name">{leg.from_station}</div>
              <div className="date-info">{formatDate(leg.departure_date)}</div>
            </div>

            <div className="leg-duration-section">
              <div className="duration-line">
                <div className="line"></div>
                <div className="duration-badge">
                  {formatDuration(Math.abs(
                    new Date(`${leg.arrival_date}T${leg.arrival_time}`) - 
                    new Date(`${leg.departure_date}T${leg.departure_time}`)
                  ) / (1000 * 60))}
                </div>
                <div className="line"></div>
              </div>
            </div>

            <div className="leg-time-section">
              <div className="arrival-time">{leg.arrival_time}</div>
              <div className="station-name">{leg.to_station}</div>
              <div className="date-info">{formatDate(leg.arrival_date)}</div>
            </div>
          </div>

          {index < legs.length - 1 && (
            <div className="connection-break">
              <div className="break-line"></div>
              <span className="connection-text">Change train at {leg.to_station}</span>
              <div className="break-line"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className={`train-card ${isCombinedRoute ? 'combined-route-card' : ''}`}>
        {/* Train Header */}
        <div className="train-header">
          <div>
            <h3 className="train-name">
              {train.name}
            </h3>
            <p className="train-number">
              {isCombinedRoute 
                ? `${train.sourceStation} → ${train.destinationStation}` 
                : `#${train.id}`
              }
            </p>
          </div>
          <div>
            <div className="train-price">{formatPrice(train.price)}</div>
            <p className="price-label">per person</p>
          </div>
        </div>

        {/* Journey Details */}
        {isCombinedRoute ? renderCombinedRoute() : renderDirectRoute()}

        {/* Action Buttons */}
        <div className="train-actions">
          <button className="book-button" onClick={handleBookNowClick}>
            Book Now
          </button>
          <button className="details-button" onClick={handleViewDetailsClick}>
            View Details
          </button>
        </div>
      </div>

      {showPopup && (
        <BookingPopup onConfirm={handleConfirm} onClose={handleClosePopup} />
      )}

      {showDetailsPopup && (
        <ViewDetailsPopup
          train={train}
          searchParams={searchParams}
          onClose={handleCloseDetailsPopup}
          isCombinedRoute={isCombinedRoute}
          legs={legs}
        />
      )}
    </>
  );
}
