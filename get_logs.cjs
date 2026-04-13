const { spawn } = require('child_process');
const ls = spawn('npx.cmd', ['vercel', 'logs', 'shinrai-go.vercel.app', '--limit', '20']);
ls.stdout.on('data', data => console.log(`STDOUT: ${data}`));
ls.stderr.on('data', data => console.error(`STDERR: ${data}`));
setTimeout(() => process.exit(0), 10000);
fetch('https://shinrai-go.vercel.app/api/health');
setInterval(() => fetch('https://shinrai-go.vercel.app/api/health'), 2000);
