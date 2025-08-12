import React, { useState, useEffect } from 'react';
import { stationAPI, trainAPI } from '../api';
import SearchForm from './SearchForm';
import TrainCard from './TrainCard';
import SortFilterControls from './SortFilterControls';

const TrainSearchPage = () => {
  const [stations, setStations] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('price_low');

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const data = await stationAPI.getStations();
      setStations(data.stations?.map(station => station.name) || []);
    } catch (err) {
      setError('Failed to load stations');
      // Mock data for development
      setStations(['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad']);
    }
  };

  const handleSearch = async (formData) => {
    setLoading(true);
    setError('');
    setSearchParams(formData);
    
    try {
      const data = await trainAPI.searchTrains(formData);
      setTrains(data.trains || []);
    } catch (err) {
      setError('Failed to search trains');
      // Mock data for development
      setTrains(generateMockTrains(formData));
    } finally {
      setLoading(false);
    }
  };

  const generateMockTrains = (searchParams) => {
    return [
      {
        name: 'Rajdhani Express',
        trainNumber: '12001',
        departure: '06:15',
        arrival: '14:30',
        duration: 495,
        distance: 1447,
        price: 2850
      },
      {
        name: 'Shatabdi Express',
        trainNumber: '12002',
        departure: '07:00',
        arrival: '15:45',
        duration: 525,
        distance: 1447,
        price: 2340
      },
      {
        name: 'Duronto Express',
        trainNumber: '12259',
        departure: '20:15',
        arrival: '06:30',
        duration: 615,
        distance: 1447,
        price: 1980
      }
    ];
  };

  const sortTrains = (trains, sortBy) => {
    const sortedTrains = [...trains];
    
    switch (sortBy) {
      case 'price_low':
        return sortedTrains.sort((a, b) => a.price - b.price);
      case 'price_high':
        return sortedTrains.sort((a, b) => b.price - a.price);
      case 'duration_low':
        return sortedTrains.sort((a, b) => a.duration - b.duration);
      case 'duration_high':
        return sortedTrains.sort((a, b) => b.duration - a.duration);
      default:
        return sortedTrains;
    }
  };

  const sortedTrains = sortTrains(trains, sortBy);

  return (
    <div className="page-container">
      {/* Search Section */}
      <div className="search-section">
        <h1 className="search-title">Find Your Perfect Train</h1>
        {error && (
          <div className="error-message" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <SearchForm stations={stations} onSearch={handleSearch} />
      </div>

      {/* Results Section */}
      {loading && (
        <div className="results-section">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Searching trains...</p>
          </div>
        </div>
      )}

      {!loading && searchParams && (
        <div className="results-section">
          {sortedTrains.length > 0 ? (
            <>
              <div className="results-header">
                <h2 className="results-title">
                  {sortedTrains.length} trains found from {searchParams.source} to {searchParams.destination}
                </h2>
                <SortFilterControls sortBy={sortBy} setSortBy={setSortBy} />
              </div>
              
              <div className="train-list">
                {sortedTrains.map((train, index) => (
                  <TrainCard
                    key={`${train.trainNumber}-${index}`}
                    train={train}
                    searchParams={searchParams}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <h2 className="no-results-text">No trains found</h2>
              <p className="no-results-subtitle">
                Try searching with different stations or dates
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainSearchPage;
