import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import SortFilterControls from '../components/SortFilterControls';
import TrainCard from '../components/TrainCard';
import axios from 'axios';

export default function TrainSearchPage() {
  const [stations, setStations] = useState([]);
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });
  const [sortBy, setSortBy] = useState('price'); // 'price' or 'time'
  const [hasSearched, setHasSearched] = useState(false);
  const [trains, setTrains] = useState([]);

  // Fetch stations from backend on mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/stations')
      .then((response) => {
        setStations(response.data.stations || []);
      })
      .catch((error) => {
        console.error('Error fetching stations:', error);
      });
  }, []);

  // Handle search
  const handleSearch = async (params) => {
    setSearchParams(params);
    setHasSearched(true);

    try {
      const res = await axios.get('http://localhost:5000/trains/search', {
        params: {
          source: params.source,
          destination: params.destination,
          date: params.date,
          sort_by: sortBy
        }
      });

      setTrains(res.data.results || []);
    } catch (err) {
      console.error('Error fetching trains:', err);
      setTrains([]);
    }
  };

  return (
    <div className="page-container">
      {/* Search Form */}
      <div className="search-section">
        <h1 className="search-title">Search Trains</h1>
        <SearchForm stations={stations} onSearch={handleSearch} />
      </div>
      {/* Results Section */}
      {hasSearched && (
        <>
          {/* Sort Controls */}
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title">
                Available Trains ({trains.length})
              </h2>
              <SortFilterControls
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          </div>

          {/* Train List */}
          <div className="train-list">
            {trains.length > 0 ? (
              trains.map((train) => (
                <TrainCard
                  key={train.train_id}
                  train={{
                    id: train.train_id,
                    name: train.train_name,
                    departure: train.departure_time,
                    arrival: train.arrival_time,
                    distance: train.distance_km,
                    price: train.price,
                    departureDate: train.departure_date,
                    arrivalDate: train.arrival_date,
                    duration: train.duration
                  }}
                  searchParams={searchParams}
                />
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-text">
                  No trains found for your search criteria
                </div>
                <div className="no-results-subtitle">
                  Try different stations or dates
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
