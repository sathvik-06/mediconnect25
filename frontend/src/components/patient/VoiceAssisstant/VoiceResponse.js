// src/components/patient/VoiceAssisstant/VoiceResponse.js
import React from 'react';

const VoiceResponse = ({ transcript, response, isListening }) => {
    return (
        <div className="voice-response">
            <div className="transcript">
                <strong>You said:</strong> {transcript}
            </div>
            {response && (
                <div className="response">
                    <strong>Response:</strong> {response}
                </div>
            )}
            {isListening && (
                <div className="listening-indicator">
                    <span className="pulse"></span> Listening...
                </div>
            )}
        </div>
    );
};

export default VoiceResponse;
