import { voiceCommands } from './voiceCommands';
import { useNavigate } from 'react-router-dom';

// Command Processor Service
class CommandProcessorService {
    constructor() {
        this.navigate = null;
        this.customHandlers = {};
        this.setupDefaultHandlers();
    }

    // Set navigation function
    setNavigate(navigateFunc) {
        this.navigate = navigateFunc;
        voiceCommands.setNavigationCallback(navigateFunc);
    }

    // Setup default command handlers
    setupDefaultHandlers() {
        // Help command
        voiceCommands.registerHandler('showHelp', () => {
            return {
                response: 'I can help you with navigation, booking appointments, managing prescriptions, and setting reminders. Try saying "book appointment" or "show my appointments".',
            };
        });

        // Stop listening command
        voiceCommands.registerHandler('stopListening', () => {
            return {
                response: 'Stopping voice assistant',
                action: () => {
                    // This will be handled by the voice context
                },
            };
        });
    }

    // Register custom handler
    registerCustomHandler(name, handler) {
        this.customHandlers[name] = handler;
        voiceCommands.registerHandler(name, handler);
    }

    // Process command
    async process(text) {
        try {
            const result = await voiceCommands.processCommand(text);
            return result;
        } catch (error) {
            console.error('Command processing error:', error);
            return {
                success: false,
                response: 'Sorry, I encountered an error processing that command',
            };
        }
    }

    // Extract and process intent
    extractIntent(text) {
        const lowerText = text.toLowerCase();

        // Navigation intents
        if (lowerText.includes('go to') || lowerText.includes('open') || lowerText.includes('show')) {
            return { type: 'navigation', text };
        }

        // Booking intents
        if (lowerText.includes('book') || lowerText.includes('schedule') || lowerText.includes('appointment')) {
            return { type: 'booking', text };
        }

        // Search intents
        if (lowerText.includes('search') || lowerText.includes('find') || lowerText.includes('look for')) {
            return { type: 'search', text };
        }

        // Upload intents
        if (lowerText.includes('upload') || lowerText.includes('add')) {
            return { type: 'upload', text };
        }

        // Help intents
        if (lowerText.includes('help') || lowerText.includes('what can you do')) {
            return { type: 'help', text };
        }

        return { type: 'unknown', text };
    }
}

export const commandProcessor = new CommandProcessorService();
export default commandProcessor;
