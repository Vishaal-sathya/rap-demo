import React, { useState, useMemo } from 'react'
import SearchForm from '../components/SearchForm'
import SortFilterControls from '../components/SortFilterControls'
import TrainCard from '../components/TrainCard'

// Sample train data
const trainData = [
  {
    id: 1,
    name: "Rajdhani Express",
    trainNumber: "12001",
    departure: "06:30",
    arrival: "14:45",
    distance: 1384,
    source: "New Delhi",
    destination: "Mumbai Central"
  },
  {
    id: 2,
    name: "Shatabdi Express",
    trainNumber: "12002",
    departure: "08:15",
    arrival: "15:30",
    distance: 956,
    source: "New Delhi",
    destination: "Chandigarh"
  },
  {
    id: 3,
    name: "Duronto Express",
    trainNumber: "12259",
    departure: "22:00",
    arrival: "08:30",
    distance: 1447,
    source: "New Delhi",
    destination: "Sealdah"
  },
  {
    id: 4,
    name: "Garib Rath",
    trainNumber: "12204",
    departure: "13:20",
    arrival: "05:15",
    distance: 1338,
    source: "New Delhi",
    destination: "Saharsa"
  },
  {
    id: 5,
    name: "Jan Shatabdi",
    trainNumber: "12056",
    departure: "11:45",
    arrival: "18:20",
    distance: 784,
    source: "New Delhi",
    destination: "Jaipur"
  }
]

const stations = [
  "New Delhi", "Mumbai Central", "Chandigarh", "Sealdah", 
  "Saharsa", "Jaipur", "Chennai Central", "Bangalore City", 
  "Hyderabad", "Pune", "Ahmedabad", "Kolkata"
]

export default function TrainSearchPage() {
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  })
  const [sortBy, setSortBy] = useState('price_low')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (params) => {
    setSearchParams(params)
    setHasSearched(true)
  }

  // Calculate price and filter trains
  const filteredTrains = useMemo(() => {
    if (!hasSearched || !searchParams.source || !searchParams.destination) {
      return []
    }
    
    return trainData.map(train => ({
      ...train,
      price: Math.round(train.distance * 1.25 * 100) / 100,
      duration: calculateDuration(train.departure, train.arrival)
    }))
  }, [hasSearched, searchParams])

  // Sort trains
  const sortedTrains = useMemo(() => {
    const trains = [...filteredTrains]
    
    switch (sortBy) {
      case 'price_low':
        return trains.sort((a, b) => a.price - b.price)
      case 'price_high':
        return trains.sort((a, b) => b.price - a.price)
      case 'duration_low':
        return trains.sort((a, b) => a.duration - b.duration)
      case 'duration_high':
        return trains.sort((a, b) => b.duration - a.duration)
      default:
        return trains
    }
  }, [filteredTrains, sortBy])

  return (
    <div className="page-container">
      {/* Search Form */}
      <div className="search-section">
        <h1 className="search-title">Search Trains</h1>
        <SearchForm 
          stations={stations}
          onSearch={handleSearch}
        />
      </div>

      {/* Results Section */}
      {hasSearched && (
        <>
          {/* Sort & Filter Controls */}
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title">
                Available Trains ({sortedTrains.length})
              </h2>
              <SortFilterControls 
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          </div>

          {/* Train Cards */}
          <div className="train-list">
            {sortedTrains.length > 0 ? (
              sortedTrains.map(train => (
                <TrainCard 
                  key={train.id} 
                  train={train}
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
  )
}

// Helper function to calculate duration in minutes
function calculateDuration(departure, arrival) {
  const [depHour, depMin] = departure.split(':').map(Number)
  const [arrHour, arrMin] = arrival.split(':').map(Number)
  
  let depMinutes = depHour * 60 + depMin
  let arrMinutes = arrHour * 60 + arrMin
  
  // Handle next day arrival
  if (arrMinutes < depMinutes) {
    arrMinutes += 24 * 60
  }
  
  return arrMinutes - depMinutes
}
