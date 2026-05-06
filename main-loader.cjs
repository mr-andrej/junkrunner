// CommonJS loader for Electron main process
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

// Aggressive cleanup function
function killAllProcesses() {
  try {
    if (process.platform === 'win32') {
      execSync('taskkill /F /IM JUNKRUNNER.exe /T 2>nul', { stdio: 'ignore' });
      execSync('taskkill /F /IM electron.exe /T 2>nul', { stdio: 'ignore' });
    } else {
      execSync('pkill -9 -f JUNKRUNNER', { stdio: 'ignore' });
      execSync('pkill -9 -f electron', { stdio: 'ignore' });
    }
  } catch (e) {}
}

process.on('uncaughtException', (err) => {
  console.error('FATAL ERROR:', err);
  killAllProcesses();
  setTimeout(() => process.exit(1), 500);
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
  killAllProcesses();
  setTimeout(() => process.exit(1), 500);
});

// Load main.js - handle both dev and packaged modes
try {
  // In packaged app, dist folder exists alongside electron/
  // In dev mode, dist doesn't exist yet
  let mainPath;
  const distPath = path.join(__dirname, 'dist');
  
  if (fs.existsSync(distPath)) {
    // Packaged mode - load from dist/electron/main.cjs
    mainPath = path.join(distPath, 'electron', 'main.cjs');
  } else {
    // Dev mode - load directly from electron/main.cjs
    mainPath = path.join(__dirname, 'electron', 'main.cjs');
  }

  console.log('Loading main from:', mainPath);
  require(mainPath);
} catch (err) {
  console.error('Failed to load main.cjs:', err.message);
  console.error('Stack:', err.stack);
  killAllProcesses();
  process.exit(1);
}
