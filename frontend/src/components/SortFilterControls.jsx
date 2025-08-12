import React from 'react'

export default function SortFilterControls({ sortBy, setSortBy }) {
  const sortOptions = [
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'duration_low', label: 'Duration: Low to High' },
    { value: 'duration_high', label: 'Duration: High to Low' }
  ]

  return (
    <div className="sort-controls">
      <label className="sort-label">
        Sort by:
      </label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
