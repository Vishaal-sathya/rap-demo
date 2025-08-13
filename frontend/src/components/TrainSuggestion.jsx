import React from 'react';
import './TrainSuggestion.css';

const TrainSuggestion = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return <div className="no-suggestions">No suggestions available</div>;
  }

  return (
    <div className="train-suggestions">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="suggestion-card">
          <div className="legs-container">
            {suggestion.legs.map((leg, legIndex) => (
              <div key={legIndex} className="leg-card">
                <div className="train-info">
                  <h3>{leg.train_name || leg.train_id}</h3>
                </div>
                <div className="route-info">
                  <div className="stations">
                    <span className="from">{leg.from_station}</span>
                    <span className="arrow">→</span>
                    <span className="to">{leg.to_station}</span>
                  </div>
                  <div className="timing">
                    <div className="departure">
                      <span className="time">{leg.departure_time}</span>
                      <span className="date">{leg.departure_date}</span>
                    </div>
                    <div className="arrival">
                      <span className="time">{leg.arrival_time}</span>
                      <span className="date">{leg.arrival_date}</span>
                    </div>
                  </div>
                </div>
                <div className="leg-details">
                  <span className="distance">{leg.distance_km} km</span>
                  <span className="price">₹{leg.price}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="suggestion-total">
            <div className="total-item">
              <span className="label">Total Distance:</span>
              <span className="value">{suggestion.total_distance_km} km</span>
            </div>
            <div className="total-item">
              <span className="label">Total Price:</span>
              <span className="value">₹{suggestion.total_price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainSuggestion;
