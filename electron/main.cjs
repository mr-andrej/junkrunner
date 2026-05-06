const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Determine correct path to index.html
  let indexPath;
  const devPath = path.join(__dirname, '..', 'dist', 'index.html');
  const prodPath = path.join(__dirname, '..', 'index.html');
  
  if (fs.existsSync(devPath)) {
    indexPath = devPath;
  } else if (fs.existsSync(prodPath)) {
    indexPath = prodPath;
  } else {
    console.error('Could not find index.html at', devPath, 'or', prodPath);
    indexPath = devPath; // fallback
  }

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${indexPath}`;

  console.log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);

  // Always show dev tools for debugging
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'exit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            // You could create an about dialog here
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (process.platform === 'win32') {
      try {
        execSync('taskkill /F /IM JUNKRUNNER.exe 2>nul', { stdio: 'ignore' });
      } catch (e) {
        // Process may not exist, ignore
      }
    }
    app.quit();
    process.exit(0);
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle any app errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
