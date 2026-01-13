// src/components/patient/DoctorSearch/DoctorSearch.js
import React, { useState, useEffect } from 'react';
import { doctorsService } from '../../../services/api/doctors';
import SearchFilters from './SearchFilters';
import DoctorList from './DoctorList';
import VoiceAssistant from '../VoiceAssisstant/VoiceAssistant';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './DoctorSearch.css';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: '',
    searchQuery: '',
    availability: 'all'
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, filters]);

  const fetchDoctors = async () => {
    try {
      const doctorsData = await doctorsService.getAllDoctors();
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = Array.isArray(doctors) ? doctors : [];

    if (filters.specialty) {
      filtered = filtered.filter(doctor =>
        doctor.specialization?.toLowerCase() === filters.specialty.toLowerCase()
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialization?.toLowerCase().includes(query) ||
        doctor.hospital?.name?.toLowerCase().includes(query)
      );
    }

    if (filters.availability === 'today') {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.availability?.workingDays?.includes(today)
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleVoiceSearch = (searchText) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: searchText
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="doctor-search">
      <div className="search-header">
        <h1>Find Doctors</h1>
        <p>Book appointments with qualified healthcare professionals</p>
      </div>

      <VoiceAssistant onVoiceCommand={handleVoiceSearch} />

      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        doctorCount={filteredDoctors.length}
      />

      <DoctorList doctors={filteredDoctors} />
    </div>
  );
};

export default DoctorSearch;