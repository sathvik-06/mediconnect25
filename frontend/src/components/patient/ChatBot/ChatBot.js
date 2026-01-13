import React, { useState, useEffect, useRef } from 'react';
import { useVoiceAssistant } from '../../../hooks/useVoiceAssistant';
import './ChatBot.css';

const ChatBot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your healthcare assistant. I can help you book appointments or find doctors. How can I help you today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Conversation State
    const [bookingStep, setBookingStep] = useState('idle'); // idle, awaiting_date, awaiting_time, confirming
    const [bookingData, setBookingData] = useState({});

    // Use the existing voice assistant hook
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        processVoiceCommand
    } = useVoiceAssistant();

    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle voice transcript updates
    useEffect(() => {
        if (transcript && !isListening) {
            handleSendMessage(transcript);
        }
    }, [transcript, isListening]);

    // Helper: Parse date from text
    const parseDate = (text) => {
        const lowerText = text.toLowerCase();
        const today = new Date();

        // Relative dates
        if (lowerText.includes('today')) return today.toDateString();
        if (lowerText.includes('tomorrow')) {
            const tmrw = new Date(today);
            tmrw.setDate(tmrw.getDate() + 1);
            return tmrw.toDateString();
        }

        // Regex for DD-MM-YYYY or DD/MM/YYYY
        const dmyMatch = text.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/);
        if (dmyMatch) {
            const [_, day, month, year] = dmyMatch;
            const fullYear = year.length === 2 ? `20${year}` : year;
            return new Date(`${year}-${month}-${day}`).toDateString();
        }

        // Regex for Month DD, YYYY (e.g., Dec 15, 2025)
        const monthMatch = text.match(/([A-MMM]{3,})\s+(\d{1,2}),?\s*(\d{4})?/i);
        if (monthMatch) {
            return new Date(text).toDateString();
        }

        return null;
    };

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), text: text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // State Machine Logic for Conversation
        let botResponse = "I'm sorry, I didn't understand that.";
        let nextStep = bookingStep;
        let showTypingDelay = 1000;

        try {
            if (bookingStep === 'awaiting_date') {
                const parsedDate = parseDate(text);
                if (parsedDate && parsedDate !== 'Invalid Date') {
                    setBookingData(prev => ({ ...prev, date: parsedDate }));
                    botResponse = `Got it, ${parsedDate}. What time would you like? (e.g., 10:00 AM)`;
                    nextStep = 'awaiting_time';
                } else {
                    botResponse = "I couldn't recognize that date. Please try format DD-MM-YYYY or say 'tomorrow'.";
                }
            } else if (bookingStep === 'awaiting_time') {
                setBookingData(prev => ({ ...prev, time: text }));
                botResponse = `Checking availability for ${bookingData.date} at ${text}...`;
                // Simulate check
                setTimeout(() => {
                    setBookingStep('confirming');
                    setMessages(prev => [...prev, {
                        id: Date.now() + 10,
                        text: `Good news! Dr. Smith is available on ${bookingData.date} at ${text}. Shall I book it? (Yes/No)`,
                        sender: 'bot'
                    }]);
                }, 1500);
                nextStep = 'processing_check'; // Intermediate state
            } else if (bookingStep === 'confirming') {
                if (text.toLowerCase().includes('yes')) {
                    botResponse = "Appointment confirmed! You have been booked with Dr. Smith. Use 'My Appointments' to view details.";
                    nextStep = 'idle';
                } else {
                    botResponse = "Okay, booking cancelled. How else can I help you?";
                    nextStep = 'idle';
                }
            } else {
                // Default: Process new command
                const result = await processVoiceCommand(text);

                if (result.type === 'search_doctors') {
                    const specialty = result.data.specialty || 'doctors';
                    botResponse = `I can help you find ${specialty}. Would you like to see a list of available ${specialty} near you?`;
                } else if (result.type === 'book_appointment') {
                    const { date } = result.data;
                    if (date) {
                        setBookingData({ date });
                        botResponse = `Okay, booking for ${date}. What time works for you?`;
                        nextStep = 'awaiting_time';
                    } else {
                        botResponse = "When would you like to book the appointment? (e.g., DD-MM-YYYY, tomorrow)";
                        nextStep = 'awaiting_date';
                    }
                } else if (result.type === 'help') {
                    botResponse = "You can ask me to 'Find a cardiologist', 'Book an appointment', or check 'Medical history'.";
                } else {
                    botResponse = "I'm learning new things every day. Try asking to 'Book appointment' or 'Find doctors'.";
                }
            }

            if (nextStep !== 'processing_check') {
                setTimeout(() => {
                    setMessages(prev => [...prev, { id: Date.now(), text: botResponse, sender: 'bot' }]);
                    setIsTyping(false);
                    setBookingStep(nextStep);
                }, showTypingDelay);
            } else {
                setIsTyping(false); // Stop typing while "checking"
            }

        } catch (error) {
            console.error("Bot Error", error);
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now(), text: "Sorry, something went wrong. Please try again.", sender: 'bot' }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage(inputText);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3>🤖 AI Assistant</h3>
                {onClose && (
                    <button className="close-btn" onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
                        ×
                    </button>
                )}
            </div>

            <div className="messages-area">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                {isTyping && (
                    <div className="message bot">
                        <div className="typing-indicator">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <button
                    className={`voice-btn ${isListening ? 'listening' : ''}`}
                    onClick={isListening ? stopListening : startListening}
                    title="Speak"
                >
                    {isListening ? '🛑' : '🎤'}
                </button>

                <input
                    type="text"
                    className="chat-input"
                    placeholder={isListening ? "Listening..." : "Type your message..."}
                    value={isListening ? transcript : inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isListening}
                />

                <button
                    className="send-btn"
                    onClick={() => handleSendMessage(inputText)}
                    disabled={!inputText.trim() && !isListening}
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
