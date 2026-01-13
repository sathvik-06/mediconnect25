// Text to Speech Service
class TextToSpeechService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.isSupported = 'speechSynthesis' in window;
        this.voices = [];
        this.defaultVoice = null;

        if (this.isSupported) {
            this.loadVoices();

            // Chrome loads voices asynchronously
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = () => this.loadVoices();
            }
        }
    }

    loadVoices() {
        this.voices = this.synth.getVoices();

        // Try to find a good default voice (English, female if available)
        this.defaultVoice = this.voices.find(voice =>
            voice.lang.startsWith('en') && voice.name.includes('Female')
        ) || this.voices.find(voice =>
            voice.lang.startsWith('en')
        ) || this.voices[0];
    }

    speak(text, options = {}) {
        if (!this.isSupported) {
            console.warn('Text-to-speech is not supported in this browser');
            return;
        }

        // Cancel any ongoing speech
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);

        // Configure utterance
        utterance.voice = options.voice || this.defaultVoice;
        utterance.pitch = options.pitch || 1;
        utterance.rate = options.rate || 1;
        utterance.volume = options.volume || 1;
        utterance.lang = options.lang || 'en-US';

        // Set up event handlers
        if (options.onStart) {
            utterance.onstart = options.onStart;
        }

        if (options.onEnd) {
            utterance.onend = options.onEnd;
        }

        if (options.onError) {
            utterance.onerror = options.onError;
        }

        if (options.onPause) {
            utterance.onpause = options.onPause;
        }

        if (options.onResume) {
            utterance.onresume = options.onResume;
        }

        // Speak
        this.synth.speak(utterance);
    }

    stop() {
        if (this.isSupported && this.synth.speaking) {
            this.synth.cancel();
        }
    }

    pause() {
        if (this.isSupported && this.synth.speaking) {
            this.synth.pause();
        }
    }

    resume() {
        if (this.isSupported && this.synth.paused) {
            this.synth.resume();
        }
    }

    isSpeaking() {
        return this.isSupported && this.synth.speaking;
    }

    isPaused() {
        return this.isSupported && this.synth.paused;
    }

    getVoices() {
        return this.voices;
    }

    setDefaultVoice(voice) {
        this.defaultVoice = voice;
    }
}

export const textToSpeech = new TextToSpeechService();
export default textToSpeech;
