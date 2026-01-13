// src/components/patient/VoiceAssistant/VoiceButton.js
import React from 'react';
import './VoiceButton.css';

const VoiceButton = ({ isListening, onClick }) => {
  return (
    <button
      className={`voice-button ${isListening ? 'listening' : ''}`}
      onClick={onClick}
    >
      <div className="voice-icon">
        {isListening ? '🎤' : '🎤'}
      </div>
      <span className="voice-text">
        {isListening ? 'Listening... Click to stop' : 'Start Voice Search'}
      </span>
      
      {isListening && (
        <div className="pulse-animation"></div>
      )}
    </button>
  );
};

export default VoiceButton;