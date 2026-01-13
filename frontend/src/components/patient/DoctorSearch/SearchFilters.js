// src/components/patient/DoctorSearch/SearchFilters.js
import React from 'react';
import './SearchFilters.css';

const SearchFilters = ({ filters, onFilterChange, doctorCount }) => {
  const specialties = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedic',
    'Gynecology',
    'Psychiatry',
    'Dentistry',
    'General Medicine'
  ];

  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="search-filters">
      <div className="filters-header">
        <h3>Filter Doctors</h3>
        <span className="doctor-count">{doctorCount} doctors found</span>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">Search</label>
          <input
            type="text"
            id="search"
            className="filter-input"
            placeholder="Search by name, specialty, or hospital..."
            value={filters.searchQuery}
            onChange={(e) => handleInputChange('searchQuery', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="specialty" className="filter-label">Specialty</label>
          <select
            id="specialty"
            className="filter-input"
            value={filters.specialty}
            onChange={(e) => handleInputChange('specialty', e.target.value)}
          >
            <option value="">All Specialties</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="availability" className="filter-label">Availability</label>
          <select
            id="availability"
            className="filter-input"
            value={filters.availability}
            onChange={(e) => handleInputChange('availability', e.target.value)}
          >
            <option value="all">All Availability</option>
            <option value="today">Available Today</option>
          </select>
        </div>

        <div className="filter-group">
          <button
            className="btn btn-secondary"
            onClick={() => onFilterChange({
              specialty: '',
              searchQuery: '',
              availability: 'all'
            })}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;