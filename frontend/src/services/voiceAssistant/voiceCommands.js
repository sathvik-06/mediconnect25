import { getCommandFromText } from '../../utils/voiceCommandsList';

// Voice Commands Service
class VoiceCommandsService {
    constructor() {
        this.commandHandlers = new Map();
        this.navigationCallback = null;
    }

    // Register a custom command handler
    registerHandler(handlerName, callback) {
        this.commandHandlers.set(handlerName, callback);
    }

    // Set navigation callback
    setNavigationCallback(callback) {
        this.navigationCallback = callback;
    }

    // Process voice command
    async processCommand(text) {
        const command = getCommandFromText(text);

        if (!command) {
            return {
                success: false,
                response: 'Sorry, I didn\'t understand that command',
            };
        }

        try {
            let result = {
                success: true,
                command: command.matchedPattern,
                category: command.category,
                response: command.response,
            };

            // Handle navigation commands
            if (command.action === 'navigate' && this.navigationCallback) {
                result.action = () => this.navigationCallback(command.target);
            }

            // Handle custom commands
            if (command.action === 'custom' && command.handler) {
                const handler = this.commandHandlers.get(command.handler);
                if (handler) {
                    const handlerResult = await handler();
                    result = { ...result, ...handlerResult };
                }
            }

            return result;
        } catch (error) {
            console.error('Error processing command:', error);
            return {
                success: false,
                response: 'Sorry, something went wrong processing that command',
            };
        }
    }

    // Extract entities from text (e.g., dates, times, names)
    extractEntities(text) {
        const entities = {};

        // Extract date patterns
        const datePatterns = [
            /today/i,
            /tomorrow/i,
            /next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
            /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
        ];

        datePatterns.forEach(pattern => {
            const match = text.match(pattern);
            if (match) {
                entities.date = match[0];
            }
        });

        // Extract time patterns
        const timePattern = /(\d{1,2}):?(\d{2})?\s*(am|pm)?/i;
        const timeMatch = text.match(timePattern);
        if (timeMatch) {
            entities.time = timeMatch[0];
        }

        return entities;
    }
}

export const voiceCommands = new VoiceCommandsService();
export default voiceCommands;
