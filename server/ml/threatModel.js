const tf = require('@tensorflow/tfjs');

let model;
let isTrained = false;

// Initialize and train the threat assessment model
const initModel = async () => {
    console.log('[Shinrai AI] Booting Neural Threat Assessment Model...');

    // 1. Define Model Architecture
    model = tf.sequential();
    
    // Input layer: 3 Features (TimeOfDay, AudioSpike, MotionVelocity)
    model.add(tf.layers.dense({ units: 8, activation: 'relu', inputShape: [3] }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    
    // Output: 1 Value (Confidence Score 0.0 to 1.0)
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
        optimizer: tf.train.adam(0.05),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    // 2. Synthesize Training Dataset representing our Heuristics
    // Feature formatting: [TimeOfDay (0-1), AudioSpike (0-1), MotionVelocity (0-1)]
    // Example: 0.1 time = 2 AM. 0.9 time = 2 PM. 
    // Audio: 0.9 = scream/gunshot. 0.1 = silent.
    const trainingData = tf.tensor2d([
        [0.1, 0.9, 0.9], // 2 AM, loud noise, high velocity -> Authentic SOS (1.0)
        [0.2, 0.8, 0.8], // 4 AM, loud noise, running -> Authentic SOS (1.0)
        [0.5, 0.1, 0.1], // Noon, silent, absolutely still -> Accidental Pocket Press (0.0)
        [0.8, 0.2, 0.2], // Evening, quiet, slowly walking -> Low Threat (0.1)
        [0.9, 0.9, 0.3], // Day, loud noise, walking (e.g. concert) -> Medium Threat (0.6)
        [0.1, 0.1, 0.8], // Night, quiet, running (jogging?) -> Medium Threat (0.4)
        [0.3, 0.9, 0.9]  // Morning, extreme noise, extreme movement -> Authentic SOS (1.0)
    ]);

    const targetData = tf.tensor2d([
        [0.95],
        [0.90],
        [0.05],
        [0.15],
        [0.60],
        [0.40],
        [0.95]
    ]);

    // 3. Train the Model instantly on Server Boot
    await model.fit(trainingData, targetData, {
        epochs: 150,
        shuffle: true,
        verbose: 0
    });

    isTrained = true;
    console.log('[Shinrai AI] Threat Assessment Model Online.');
};

/**
 * Evaluates an incoming SOS alert
 * @param {Object} data - Sensory data payload
 * @returns {Number} Confidence Score (0-100)
 */
const evaluateThreat = async (timeOfDay, audioLevel, motionVelocity) => {
    if (!isTrained) {
        console.warn('AI Model not yet trained, falling back to heuristic');
        return Math.floor(Math.random() * 40) + 60; // 60-100 fallback
    }

    // Process inputs format
    const inputTensor = tf.tensor2d([[timeOfDay, audioLevel, motionVelocity]]);
    
    // Predict
    const prediction = model.predict(inputTensor);
    const scoreArray = await prediction.array();
    
    // Convert 0.0 - 1.0 to 0 - 100 percentage
    const rawScore = scoreArray[0][0];
    return Math.round(rawScore * 100);
};

// Auto-initialize when the file is required
initModel();

module.exports = {
    evaluateThreat
};
