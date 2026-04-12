const { execSync } = require('child_process');
const fs = require('fs');

try {
    const raw = fs.readFileSync('./server/serviceAccountKey.json', 'utf8');
    const parsed = JSON.parse(raw);
    const cleanString = JSON.stringify(parsed);
    
    console.log('[DEBUG] Pushing JSON of length:', cleanString.length);

    console.log('Sending down the pipeline...');
    execSync('npx vercel env add FIREBASE_SERVICE_ACCOUNT production --force', {
        input: cleanString,
        encoding: 'utf-8',
        stdio: ['pipe', 'inherit', 'inherit']
    });

} catch(e) {
    console.error('[CRITICAL] Exception:', e.message);
}
