const { spawn } = require('child_process');
const path = require('path');

console.log('Starting SymptomChecker MERN Stack application...');
console.log('Running backend and frontend servers in parallel...');

const runProcess = (name, command, args, cwd) => {
  const proc = spawn(command, args, {
    cwd: path.resolve(__dirname, cwd),
    shell: true,
    stdio: 'inherit'
  });

  proc.on('error', (err) => {
    console.error(`Failed to start ${name}:`, err);
  });

  proc.on('close', (code) => {
    console.log(`${name} process exited with code ${code}`);
    if (code !== 0) {
      process.exit(code);
    }
  });

  return proc;
};

// Start processes
const backend = runProcess('Backend', 'npm', ['run', 'dev'], './backend');
const frontend = runProcess('Frontend', 'npm', ['run', 'dev'], './frontend');

// Handle process termination signals to clean up child processes
const cleanup = () => {
  console.log('\nShutting down servers...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
