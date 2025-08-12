import React, { useState } from 'react'

export default function SearchForm({ stations, onSearch }) {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    date: ''
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.source) newErrors.source = 'Please select source station'
    if (!formData.destination) newErrors.destination = 'Please select destination station'
    if (!formData.date) newErrors.date = 'Please select travel date'
    if (formData.source === formData.destination) {
      newErrors.destination = 'Source and destination cannot be same'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSearch(formData)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Get tomorrow's date as minimum date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-grid">
        {/* Source Station */}
        <div className="form-field">
          <label className="form-label">
            From
          </label>
          <select
            value={formData.source}
            onChange={(e) => handleChange('source', e.target.value)}
            className={`form-select ${errors.source ? 'error' : ''}`}
          >
            <option value="">Select source station</option>
            {stations.map(station => (
              <option key={station} value={station}>{station}</option>
            ))}
          </select>
          {errors.source && (
            <p className="error-message">{errors.source}</p>
          )}
        </div>

        {/* Destination Station */}
        <div className="form-field">
          <label className="form-label">
            To
          </label>
          <select
            value={formData.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            className={`form-select ${errors.destination ? 'error' : ''}`}
          >
            <option value="">Select destination station</option>
            {stations.filter(station => station !== formData.source).map(station => (
              <option key={station} value={station}>{station}</option>
            ))}
          </select>
          {errors.destination && (
            <p className="error-message">{errors.destination}</p>
          )}
        </div>

        {/* Date */}
        <div className="form-field">
          <label className="form-label">
            Departure Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            min={minDate}
            className={`form-input ${errors.date ? 'error' : ''}`}
          />
          {errors.date && (
            <p className="error-message">{errors.date}</p>
          )}
        </div>

        {/* Search Button */}
        <div className="form-field">
          <label className="form-label invisible-label">
            Search
          </label>
          <button
            type="submit"
            className="search-button"
          >
            Search Trains
          </button>
        </div>
      </div>
    </form>
  )
}