import React from 'react';
import TrainCard from './TrainCard';
import './TrainSuggestion.css';

const TrainSuggestion = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return <div className="no-suggestions">No suggestions available</div>;
  }

  return (
    <div className="train-suggestions-fullwidth">
      {suggestions.slice(0, 10).map((suggestion, index) => {
        // Transform suggestion data to match TrainCard props
        const trainData = {
          name: suggestion.legs.map(leg => leg.train_name).join(" + "),
          id: `combined-${index}`,
          price: suggestion.total_price,
          distance: suggestion.total_distance_km,
          departure: suggestion.legs[0].departure_time,
          arrival: suggestion.legs[suggestion.legs.length - 1].arrival_time,
          departureDate: suggestion.legs[0].departure_date,
          arrivalDate: suggestion.legs[suggestion.legs.length - 1].arrival_date,
          duration: suggestion.total_duration || 0,
          sourceStation: suggestion.legs[0].from_station,
          destinationStation: suggestion.legs[suggestion.legs.length - 1].to_station,
          totalLegs: suggestion.legs.length,
          journeyType: 'combined'
        };

        const searchParams = {
          source: suggestion.legs[0].from_station,
          destination: suggestion.legs[suggestion.legs.length - 1].to_station,
          date: suggestion.legs[0].departure_date
        };

        // Transform legs data to match expected format
        const transformedLegs = suggestion.legs.map(leg => ({
          train_id: leg.train_id,
          train_name: leg.train_name,
          from_station: leg.from_station || leg.from,
          to_station: leg.to_station || leg.to,
          departure_date: leg.departure_date,
          departure_time: leg.departure_time,
          arrival_date: leg.arrival_date,
          arrival_time: leg.arrival_time,
          distance_km: leg.distance_km,
          price: leg.price
        }));

        return (
          <div key={index} className="combined-route-wrapper">
            <TrainCard
              train={trainData}
              searchParams={searchParams}
              isCombinedRoute={true}
              legs={transformedLegs}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TrainSuggestion;
