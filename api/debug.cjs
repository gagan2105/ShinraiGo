module.exports = (req, res) => {
    res.json({
        hasMongo: !!process.env.MONGODB_URI,
        hasFirebase: !!process.env.FIREBASE_SERVICE_ACCOUNT,
        nodeVersion: process.version,
        env: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('PASS'))
    });
};
