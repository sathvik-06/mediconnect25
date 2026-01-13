// src/components/patient/VoiceAssistant/VoiceAssistant.js
import React, { useState } from 'react';
import { useVoiceAssistant } from '../../../hooks/useVoiceAssistant';
import VoiceButton from './VoiceButton';
import VoiceCommands from './VoiceCommands';
import VoiceResponse from './VoiceResponse';
import './VoiceAssistant.css';

const VoiceAssistant = ({ onVoiceCommand }) => {
  const [showCommands, setShowCommands] = useState(false);
  const {
    isListening,
    transcript,
    response,
    startListening,
    stopListening,
    processVoiceCommand
  } = useVoiceAssistant();

  const handleVoiceInput = async () => {
    if (isListening) {
      stopListening();
      
      if (transcript) {
        const result = await processVoiceCommand(transcript);
        
        if (result.type === 'search_doctors') {
          onVoiceCommand?.(result.data.searchQuery);
        }
        
        if (result.type === 'book_appointment') {
          // This would navigate to booking page in real implementation
          console.log('Voice booking:', result.data);
        }
      }
    } else {
      startListening();
    }
  };

  const quickCommands = [
    "Find cardiologists near me",
    "Book appointment tomorrow",
    "Show available doctors",
    "Search for pediatricians"
  ];

  return (
    <div className="voice-assistant">
      <div className="voice-header">
        <h3>Voice Assistant</h3>
        <button 
          className="btn btn-outline btn-small"
          onClick={() => setShowCommands(!showCommands)}
        >
          {showCommands ? 'Hide Commands' : 'Show Commands'}
        </button>
      </div>

      <div className="voice-controls">
        <VoiceButton 
          isListening={isListening}
          onClick={handleVoiceInput}
        />
        
        {transcript && (
          <VoiceResponse 
            transcript={transcript}
            response={response}
            isListening={isListening}
          />
        )}
      </div>

      {showCommands && (
        <VoiceCommands 
          commands={quickCommands}
          onCommandClick={(command) => {
            // Simulate voice input for quick commands
            processVoiceCommand(command);
            onVoiceCommand?.(command);
          }}
        />
      )}
    </div>
  );
};

export default VoiceAssistant;