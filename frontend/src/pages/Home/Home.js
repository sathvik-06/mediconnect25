// src/pages/Home/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import HeroSection from './HeroSection';
import Features from './Features';
import HowItWorks from './HowItWorks';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <HeroSection isAuthenticated={isAuthenticated} user={user} />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default Home;