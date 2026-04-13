const { execSync } = require('child_process');

console.log('Fixing MONGODB_URI...');
execSync('npx vercel env add MONGODB_URI production --force', {
    input: "mongodb+srv://admin:gagan2105x@cluster0.fbeqddl.mongodb.net/shinraigo?retryWrites=true&w=majority",
    encoding: 'utf-8',
    stdio: ['pipe', 'inherit', 'inherit']
});
console.log('Done.');
