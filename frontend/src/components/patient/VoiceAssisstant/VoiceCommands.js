// src/components/patient/VoiceAssisstant/VoiceCommands.js
import React from 'react';

const VoiceCommands = ({ commands, onCommandClick }) => {
    return (
        <div className="voice-commands">
            <h4>Quick Commands</h4>
            <div className="commands-list">
                {commands.map((command, index) => (
                    <button
                        key={index}
                        className="command-button"
                        onClick={() => onCommandClick(command)}
                    >
                        {command}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VoiceCommands;
