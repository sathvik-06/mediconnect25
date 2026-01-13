import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { speechRecognition } from '../services/voiceAssistant/speechRecognition';
import { textToSpeech } from '../services/voiceAssistant/textToSpeech';
import { commandProcessor } from '../services/voiceAssistant/commandProcessor';

const VoiceContext = createContext(null);

export const VoiceProvider = ({ children }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [lastCommand, setLastCommand] = useState(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const [error, setError] = useState(null);

    const recognitionRef = useRef(null);

    useEffect(() => {
        if (isEnabled) {
            initializeVoiceAssistant();
        }

        return () => {
            stopListening();
        };
    }, [isEnabled]);

    const initializeVoiceAssistant = () => {
        try {
            recognitionRef.current = speechRecognition.initialize({
                onResult: handleSpeechResult,
                onEnd: handleSpeechEnd,
                onError: handleSpeechError,
            });
        } catch (err) {
            setError('Voice assistant not supported in this browser');
            console.error('Voice initialization failed:', err);
        }
    };

    const handleSpeechResult = (text) => {
        setTranscript(text);
        processCommand(text);
    };

    const handleSpeechEnd = () => {
        setIsListening(false);
    };

    const handleSpeechError = (error) => {
        setError(error.message);
        setIsListening(false);
    };

    const processCommand = async (text) => {
        try {
            const result = await commandProcessor.process(text);
            setLastCommand(result);

            if (result.response) {
                speak(result.response);
            }

            if (result.action) {
                result.action();
            }
        } catch (err) {
            console.error('Command processing failed:', err);
            speak('Sorry, I could not process that command');
        }
    };

    const startListening = () => {
        if (!isEnabled) {
            setError('Please enable voice assistant first');
            return;
        }

        try {
            speechRecognition.start(recognitionRef.current);
            setIsListening(true);
            setError(null);
        } catch (err) {
            setError('Failed to start listening');
            console.error(err);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            speechRecognition.stop(recognitionRef.current);
            setIsListening(false);
        }
    };

    const speak = (text) => {
        setIsSpeaking(true);
        textToSpeech.speak(text, {
            onEnd: () => setIsSpeaking(false),
            onError: (err) => {
                console.error('Speech synthesis failed:', err);
                setIsSpeaking(false);
            },
        });
    };

    const stopSpeaking = () => {
        textToSpeech.stop();
        setIsSpeaking(false);
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const enableVoiceAssistant = () => {
        setIsEnabled(true);
    };

    const disableVoiceAssistant = () => {
        stopListening();
        stopSpeaking();
        setIsEnabled(false);
    };

    const value = {
        isListening,
        isSpeaking,
        transcript,
        lastCommand,
        isEnabled,
        error,
        startListening,
        stopListening,
        toggleListening,
        speak,
        stopSpeaking,
        enableVoiceAssistant,
        disableVoiceAssistant,
    };

    return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};

export const useVoice = () => {
    const context = useContext(VoiceContext);
    if (!context) {
        throw new Error('useVoice must be used within VoiceProvider');
    }
    return context;
};

export default VoiceContext;
