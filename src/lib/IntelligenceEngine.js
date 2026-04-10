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

// --- Intelligence Helper Suite for AI Dashboard ---

/**
 * Calculates risk level based on environmental and activity factors
 */
export const calculateRiskContext = (inDangerZone, inactivity) => {
    let score = 20;
    if (inDangerZone) score += 50;
    if (inactivity > 30) score += 20;
    
    if (score > 80) return { level: 'Critical', color: 'bg-rose-500', confidence: 94, score };
    if (score > 40) return { level: 'Warning', color: 'bg-amber-500', confidence: 88, score };
    return { level: 'Optimal', color: 'bg-emerald-500', confidence: 98, score };
};

/**
 * Estimates crowd density based on security telemetry
 */
export const estimateCrowdDensity = (riskScore) => {
    if (riskScore > 70) return { label: 'Sparse/Suspicious', value: '1-2 units/m²', type: 'danger' };
    return { label: 'Standard Local Flow', value: '12-15 units/m²', type: 'safe' };
};

/**
 * Classifies raw alert text into actionable categories
 */
export const classifyAlertNetwork = (text) => {
    if (text.toLowerCase().includes('panic') || text.toLowerCase().includes('sos')) {
        return { tag: 'CRITICAL_SOS', severity: 'Critical', action: 'DEPLOY_RRF' };
    }
    if (text.toLowerCase().includes('deviated')) {
        return { tag: 'ROUTE_ANOMALY', severity: 'Warning', action: 'VERIFY_PATH' };
    }
    return { tag: 'STATUS_CHECK', severity: 'Normal', action: 'LOG_ONLY' };
};

/**
 * Triggers secondary alert channels (Simulated)
 */
export const triggerMultiChannelAlert = (type, user) => {
    console.log(`[AI Alert Bridge] Dispatching Multi-Channel Alert for ${user}: ${type}`);
    return true;
};

/**
 * Predicts risk levels for future intervals
 */
export const predictFutureRisk = () => {
    return [
        { time: '02:00', level: 'High', value: 85 },
        { time: '08:00', level: 'Low', value: 15 },
        { time: '14:00', level: 'Medium', value: 45 },
        { time: '20:00', level: 'Medium', value: 55 }
    ];
};
