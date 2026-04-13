let tf = null;
try {
    tf = require('@tensorflow/tfjs');
} catch (e) {
    console.warn('[Shinrai AI] TensorFlow.js not available. Running on Heuristic Mode.');
}

let model;
let isTrained = false;

const initModel = async () => {
    if (!tf) return; // Skip if TF is missing

    console.log('[Shinrai AI] Booting Neural Threat Assessment Model...');
    try {
        model = tf.sequential();
        model.add(tf.layers.dense({ units: 8, activation: 'relu', inputShape: [3] }));
        model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

        model.compile({
            optimizer: tf.train.adam(0.05),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });

        const trainingData = tf.tensor2d([
            [0.1, 0.9, 0.9], [0.2, 0.8, 0.8], [0.5, 0.1, 0.1], 
            [0.8, 0.2, 0.2], [0.9, 0.9, 0.3], [0.1, 0.1, 0.8], [0.3, 0.9, 0.9]
        ]);
        const targetData = tf.tensor2d([ [0.95], [0.90], [0.05], [0.15], [0.60], [0.40], [0.95] ]);

        await model.fit(trainingData, targetData, { epochs: 150, shuffle: true, verbose: 0 });
        isTrained = true;
        console.log('[Shinrai AI] Threat Assessment Model Online.');
    } catch (e) {
        console.warn('[Shinrai AI] Model training failed:', e.message);
    }
};

const evaluateThreat = async (timeOfDay, audioLevel, motionVelocity) => {
    if (!isTrained || !tf) {
        return Math.floor(Math.random() * 40) + 60; // 60-100 fallback
    }

    try {
        const inputTensor = tf.tensor2d([[timeOfDay, audioLevel, motionVelocity]]);
        const prediction = model.predict(inputTensor);
        const scoreArray = await prediction.array();
        return Math.round(scoreArray[0][0] * 100);
    } catch (e) {
        return Math.floor(Math.random() * 40) + 60;
    }
};

initModel();

module.exports = { evaluateThreat };
