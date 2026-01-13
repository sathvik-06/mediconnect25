// src/hooks/useVoiceAssistant.js
import { useState, useCallback, useEffect } from 'react';

export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setResponse('');
      };

      recognitionInstance.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processVoiceCommand(text);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setResponse('Sorry, I encountered an error. Please try again.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setResponse('Speech recognition not supported in your browser.');
      }
    } else {
      setResponse('Speech recognition is not available in your browser.');
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  const processVoiceCommand = useCallback(async (command) => {
    const lowerCommand = command.toLowerCase();
    let result = { type: 'unknown', data: {} };

    // Doctor search commands
    if (lowerCommand.includes('find') || lowerCommand.includes('search') || lowerCommand.includes('look for')) {
      const specialtyMatch = lowerCommand.match(/(cardiologist|dermatologist|neurologist|pediatrician|orthopedic|gynecologist|psychiatrist|dentist)/);
      const specialty = specialtyMatch ? specialtyMatch[1] : '';
      
      result = {
        type: 'search_doctors',
        data: {
          searchQuery: command,
          specialty: specialty
        }
      };
      setResponse(`Searching for ${specialty || 'doctors'}...`);
    }
    
    // Appointment booking commands
    else if (lowerCommand.includes('book') || lowerCommand.includes('schedule') || lowerCommand.includes('appointment')) {
      const timeMatch = lowerCommand.match(/(\d+):?(\d+)?\s*(am|pm)/i) || 
                       lowerCommand.match(/(morning|afternoon|evening)/);
      const dateMatch = lowerCommand.match(/(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
      
      result = {
        type: 'book_appointment',
        data: {
          time: timeMatch ? timeMatch[0] : '',
          date: dateMatch ? dateMatch[0] : ''
        }
      };
      setResponse(`Booking appointment for ${dateMatch ? dateMatch[0] : 'soon'}...`);
    }
    
    // General help
    else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      result = { type: 'help', data: {} };
      setResponse('I can help you find doctors, book appointments, and search for medical services. Try saying "find a cardiologist" or "book appointment tomorrow".');
    }
    
    else {
      setResponse('I\'m not sure how to help with that. Try saying "find doctors" or "book appointment".');
    }

    return result;
  }, []);

  // Auto-stop listening after 10 seconds
  useEffect(() => {
    let timeout;
    if (isListening) {
      timeout = setTimeout(() => {
        stopListening();
        setResponse('Listening timed out. Please try again.');
      }, 10000);
    }
    return () => clearTimeout(timeout);
  }, [isListening, stopListening]);

  return {
    isListening,
    transcript,
    response,
    startListening,
    stopListening,
    processVoiceCommand
  };
};