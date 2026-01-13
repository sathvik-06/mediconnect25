// src/components/patient/Dashboard/PatientDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../../services/api/appointments';
import UpcomingAppointments from './UpcomingAppointments';
import QuickActions from './QuickActions';
import ChatBot from '../ChatBot/ChatBot';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './PatientDashboard.css';
import './VoiceDashboard.css';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  });
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsData] = await Promise.all([
        appointmentService.getPatientAppointments()
      ]);

      setAppointments(appointmentsData);

      const upcoming = appointmentsData.filter(apt =>
        new Date(apt.date) > new Date() && apt.status === 'scheduled'
      ).length;

      const completed = appointmentsData.filter(apt =>
        apt.status === 'completed'
      ).length;

      setStats({
        totalAppointments: appointmentsData.length,
        upcomingAppointments: upcoming,
        completedAppointments: completed
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <p>Welcome back! Here's your healthcare overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.completedAppointments}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-info">
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-left">
          <UpcomingAppointments appointments={appointments} />
        </div>

        <div className="content-right">
          <QuickActions onVoiceClick={() => setShowVoiceAssistant(!showVoiceAssistant)} />
          {showVoiceAssistant && (
            <div className="voice-assistant-container">
              <ChatBot onClose={() => setShowVoiceAssistant(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;