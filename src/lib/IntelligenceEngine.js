/**
 * Shinrai Intelligence Engine
 * Handles background audio analysis and kinetic sensor fusion.
 */

export class IntelligenceEngine {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.scriptProcessor = null;
        this.isMonitoring = false;
        this.threshold = 0.65; // Sensitivity for scream detection
    }

    async startAcousticMonitoring(onThresholdExceeded) {
        if (this.isMonitoring) return;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.scriptProcessor = this.audioContext.createScriptProcessor(2048, 1, 1);

            this.analyser.smoothingTimeConstant = 0.8;
            this.analyser.fftSize = 1024;

            this.microphone.connect(this.analyser);
            this.analyser.connect(this.scriptProcessor);
            this.scriptProcessor.connect(this.audioContext.destination);

            this.scriptProcessor.onaudioprocess = () => {
                const array = new Uint8Array(this.analyser.frequencyBinCount);
                this.analyser.getByteFrequencyData(array);
                let values = 0;

                for (let i = 0; i < array.length; i++) {
                    values += array[i];
                }

                const average = values / array.length;
                const volume = average / 255;

                if (volume > this.threshold) {
                    onThresholdExceeded(volume);
                }
            };

            this.isMonitoring = true;
        } catch (err) {
            console.error("Acoustic Monitoring Error:", err);
        }
    }

    stopAcousticMonitoring() {
        if (this.audioContext) {
            this.audioContext.close();
            this.isMonitoring = false;
        }
    }
}

export const NeuralSentinel = new IntelligenceEngine();
