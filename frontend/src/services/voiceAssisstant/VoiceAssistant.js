class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.commands = {};

        if ('webkitSpeechRecognition' in window) {
            this.recognition = new window.webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.lang = 'en-US';
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                this.handleCommand(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                this.isListening = false;
            };

            this.recognition.onend = () => {
                this.isListening = false;
            };
        }
    }

    startListening(onResult) {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
            this.isListening = true;
            if (onResult) {
                this.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    onResult(transcript);
                    this.handleCommand(transcript.toLowerCase());
                };
            }
        } else if (!this.recognition) {
            console.warn('Speech recognition not supported');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    speak(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            this.synthesis.speak(utterance);
        }
    }

    registerCommand(command, action) {
        this.commands[command] = action;
    }

    handleCommand(transcript) {
        console.log('Command received:', transcript);
        // Simple command matching
        for (const [command, action] of Object.entries(this.commands)) {
            if (transcript.includes(command)) {
                action();
                return;
            }
        }
    }
}

export default new VoiceAssistant();
