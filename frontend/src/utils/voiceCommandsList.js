// Voice commands list with patterns and actions
export const VOICE_COMMANDS_LIST = [
    {
        category: 'Navigation',
        commands: [
            {
                patterns: ['go to dashboard', 'open dashboard', 'show dashboard'],
                action: 'navigate',
                target: '/dashboard',
                response: 'Opening dashboard',
            },
            {
                patterns: ['go to appointments', 'show appointments', 'my appointments'],
                action: 'navigate',
                target: '/appointments',
                response: 'Opening appointments',
            },
            {
                patterns: ['go to doctors', 'find doctors', 'search doctors'],
                action: 'navigate',
                target: '/doctors',
                response: 'Opening doctor search',
            },
            {
                patterns: ['go to medical history', 'show history', 'my history'],
                action: 'navigate',
                target: '/medical-history',
                response: 'Opening medical history',
            },
            {
                patterns: ['go to prescriptions', 'show prescriptions', 'my prescriptions'],
                action: 'navigate',
                target: '/prescriptions',
                response: 'Opening prescriptions',
            },
            {
                patterns: ['go home', 'home page', 'main page'],
                action: 'navigate',
                target: '/',
                response: 'Going to home page',
            },
        ],
    },
    {
        category: 'Appointments',
        commands: [
            {
                patterns: ['book appointment', 'schedule appointment', 'make appointment', 'new appointment'],
                action: 'navigate',
                target: '/book-appointment',
                response: 'Let me help you book an appointment',
            },
            {
                patterns: ['cancel appointment', 'cancel my appointment'],
                action: 'custom',
                handler: 'cancelAppointment',
                response: 'Which appointment would you like to cancel?',
            },
            {
                patterns: ['upcoming appointments', 'next appointment', 'future appointments'],
                action: 'custom',
                handler: 'showUpcomingAppointments',
                response: 'Showing your upcoming appointments',
            },
        ],
    },
    {
        category: 'Prescriptions',
        commands: [
            {
                patterns: ['upload prescription', 'add prescription', 'new prescription'],
                action: 'navigate',
                target: '/upload-prescription',
                response: 'Opening prescription upload',
            },
            {
                patterns: ['latest prescription', 'recent prescription', 'last prescription'],
                action: 'custom',
                handler: 'showLatestPrescription',
                response: 'Showing your latest prescription',
            },
        ],
    },
    {
        category: 'Reminders',
        commands: [
            {
                patterns: ['set reminder', 'add reminder', 'create reminder'],
                action: 'navigate',
                target: '/reminders',
                response: 'Opening reminders',
            },
            {
                patterns: ['show reminders', 'my reminders', 'list reminders'],
                action: 'custom',
                handler: 'showReminders',
                response: 'Here are your reminders',
            },
        ],
    },
    {
        category: 'Help',
        commands: [
            {
                patterns: ['help', 'what can you do', 'commands', 'voice commands'],
                action: 'custom',
                handler: 'showHelp',
                response: 'I can help you navigate, book appointments, manage prescriptions, and set reminders. Just ask!',
            },
            {
                patterns: ['stop listening', 'stop', 'cancel'],
                action: 'custom',
                handler: 'stopListening',
                response: 'Okay, I\'ll stop listening',
            },
        ],
    },
];

// Get command from text
export const getCommandFromText = (text) => {
    const lowerText = text.toLowerCase().trim();

    for (const category of VOICE_COMMANDS_LIST) {
        for (const command of category.commands) {
            for (const pattern of command.patterns) {
                if (lowerText.includes(pattern)) {
                    return {
                        ...command,
                        category: category.category,
                        matchedPattern: pattern,
                    };
                }
            }
        }
    }

    return null;
};

// Get all command patterns (for help display)
export const getAllCommandPatterns = () => {
    const patterns = {};

    VOICE_COMMANDS_LIST.forEach(category => {
        patterns[category.category] = category.commands.map(cmd => cmd.patterns[0]);
    });

    return patterns;
};

// Check if text contains wake word
export const containsWakeWord = (text) => {
    const wakeWords = ['hey mediconnect', 'hello mediconnect', 'mediconnect'];
    const lowerText = text.toLowerCase();
    return wakeWords.some(word => lowerText.includes(word));
};

export default {
    VOICE_COMMANDS_LIST,
    getCommandFromText,
    getAllCommandPatterns,
    containsWakeWord,
};
