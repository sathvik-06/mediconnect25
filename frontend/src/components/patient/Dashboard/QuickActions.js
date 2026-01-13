// src/components/patient/Dashboard/QuickActions.js
import React from 'react';
import { Link } from 'react-router-dom';
import './QuickActions.css';

const QuickActions = ({ onVoiceClick }) => {
  const quickActions = [
    {
      icon: '👨‍⚕️',
      title: 'Find Doctors',
      description: 'Book appointment with specialists',
      path: '/patient/doctors',
      color: '#2563eb'
    },
    {
      icon: '💊',
      title: 'Upload Prescription',
      description: 'Order medicines online',
      path: '/patient/prescriptions',
      color: '#059669'
    },
    {
      icon: '📋',
      title: 'Medical History',
      description: 'View your health records',
      path: '/patient/medical-history',
      color: '#7c3aed'
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Chat or Voice booking',
      path: '/patient/dashboard',
      color: '#dc2626',
      action: 'voice'
    }
  ];

  const handleVoiceAssistant = () => {
    if (onVoiceClick) {
      onVoiceClick();
    }
  };

  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="actions-grid">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="action-card"
            onClick={action.action === 'voice' ? handleVoiceAssistant : undefined}
            style={{ '--action-color': action.color }}
          >
            {action.action === 'voice' ? (
              <div className="action-content">
                <div className="action-icon" style={{ backgroundColor: action.color + '20' }}>
                  {action.icon}
                </div>
                <div className="action-info">
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
              </div>
            ) : (
              <Link to={action.path} className="action-content">
                <div className="action-icon" style={{ backgroundColor: action.color + '20' }}>
                  {action.icon}
                </div>
                <div className="action-info">
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;