// Speech Recognition Service
class SpeechRecognitionService {
    constructor() {
        this.recognition = null;
        this.isSupported = this.checkSupport();
    }

    checkSupport() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    initialize(options = {}) {
        if (!this.isSupported) {
            throw new Error('Speech recognition is not supported in this browser');
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        // Configure recognition
        this.recognition.continuous = options.continuous || false;
        this.recognition.interimResults = options.interimResults || true;
        this.recognition.lang = options.lang || 'en-US';
        this.recognition.maxAlternatives = options.maxAlternatives || 1;

        // Set up event handlers
        if (options.onResult) {
            this.recognition.onresult = (event) => {
                const last = event.results.length - 1;
                const transcript = event.results[last][0].transcript;
                options.onResult(transcript, event);
            };
        }

        if (options.onEnd) {
            this.recognition.onend = options.onEnd;
        }

        if (options.onError) {
            this.recognition.onerror = options.onError;
        }

        if (options.onStart) {
            this.recognition.onstart = options.onStart;
        }

        return this.recognition;
    }

    start(recognition = this.recognition) {
        if (!recognition) {
            throw new Error('Speech recognition not initialized');
        }

        try {
            recognition.start();
        } catch (error) {
            console.error('Failed to start recognition:', error);
            throw error;
        }
    }

    stop(recognition = this.recognition) {
        if (recognition) {
            recognition.stop();
        }
    }

    abort(recognition = this.recognition) {
        if (recognition) {
            recognition.abort();
        }
    }
}

export const speechRecognition = new SpeechRecognitionService();
export default speechRecognition;
