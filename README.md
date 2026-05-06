# JUNKRUNNER Electron App

A cyberpunk terminal game built with React and Electron.

## Setup & Installation

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode** (with hot reload):
   ```bash
   npm run dev
   ```
   This will:
   - Start a Vite dev server on http://localhost:5173
   - Automatically launch the Electron app
   - Open DevTools for debugging

3. **Build for production:**
   ```bash
   npm run dist
   ```
   This creates:
   - `dist/` - Bundled React app
   - Windows .exe installer in `dist/` folder
   - Portable executable (.exe) option

## Project Structure

```
junkrunner/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Security preload script
├── src/
│   ├── Game.jsx         # Main game component
│   ├── App.jsx          # React app wrapper
│   └── index.jsx        # React entry point
├── public/
│   └── index.html       # HTML template
├── vite.config.js       # Vite bundler config
├── package.json         # Project config & dependencies
└── .gitignore
```

## Commands

- `npm run dev` - Start dev server + Electron app
- `npm run build` - Build React app only
- `npm run build:electron` - Create installer/portable exe
- `npm run pack` - Build without creating installer
- `npm run dist` - Full build (React + Electron installer)

## Output

After running `npm run dist`, you'll find:
- **JUNKRUNNER Installer** - Standard installer (.exe)
- **JUNKRUNNER Portable** - Standalone executable (no installation needed)

Both are in the `dist/` folder.

## Development Tips

- Press `Ctrl+R` in the app to reload
- Press `F12` to open DevTools (dev mode only)
- Create a `public/icon.ico` (256x256) to use as app icon
- The game saves to JSON files on your computer

## Troubleshooting

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**App won't start:**
- Make sure Node.js is installed: `node --version`
- Try clearing the dist folder: `rm -rf dist`
- Rebuild: `npm run dist`

**Build is slow:**
- First build takes longer. Subsequent builds are much faster.
- On Windows, temporarily disable antivirus scanning during build.

## Notes

- The game uses React Hooks for state management
- Terminal output is rendered as a scrollable div
- Save files are JSON format
-  Modify `src/Game.jsx` to change game logic
