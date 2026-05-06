```
:......::::.......:::..::::..::..::::..::..:::::..:::.......:::..::::..::..::::..::........::..:::::..::
::::::'##:'##::::'##:'##::: ##:'##:::'##:'########::'##::::'##:'##::: ##:'##::: ##:'########:'########::
:::::: ##: ##:::: ##: ###:: ##: ##::'##:: ##.... ##: ##:::: ##: ###:: ##: ###:: ##: ##.....:: ##.... ##:
:::::: ##: ##:::: ##: ####: ##: ##:'##::: ##:::: ##: ##:::: ##: ####: ##: ####: ##: ##::::::: ##:::: ##:
:::::: ##: ##:::: ##: ## ## ##: #####:::: ########:: ##:::: ##: ## ## ##: ## ## ##: ######::: ########::
:##::: ##: ##:::: ##: ##. ####: ##. ##::: ##.. ##::: ##:::: ##: ##. ####: ##. ####: ##...:::: ##.. ##:::
:##::: ##: ##:::: ##: ##:. ###: ##:. ##:: ##::. ##:: ##:::: ##: ##:. ###: ##:. ###: ##::::::: ##::. ##::
: ######::. #######:: ##::. ##: ##::. ##: ##:::. ##:. #######:: ##::. ##: ##::. ##: ########: ##:::. ##:
:......::::.......:::..::::..::..::::..::..:::::..:::.......:::..::::..::..::::..::........::..:::::..::
```

<div align="center">

### ⚡ A cyberpunk terminal-based game built with **React**, **TypeScript**, **Vite**, and **Electron**

![Status](https://img.shields.io/badge/status-EARLY%20BUILD-red?style=flat-square&logo=github)
![Version](https://img.shields.io/badge/version-0.1.0-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

</div>

---

## ⚠️ **EARLY BUILD DISCLAIMER**

This is a **pre-release alpha build**. Expect:
- 🐛 Bugs and crashes
- 🔄 Frequent changes to mechanics and balance
- 💾 Save file incompatibility between versions
- ⚙️ Performance issues on some systems

**Not recommended for production use.** Use at your own risk and report issues!

---

## 🎮 About

Play as a hacker scraping together credits to pay off crippling debt in a neon-soaked future. Manage your custom rig, take contracts, deal with heat and trace levels, and navigate the dangerous underbelly of cyberspace.

## 🚀 Quick Start

### Prerequisites
- **Node.js 16+** ([Download](https://nodejs.org/))
- **npm** (included with Node.js)

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd junkrunner

# Install dependencies
npm install

# Run development mode (hot reload + dev tools)
npm run dev

# Or build production executable
npm run dist
```

## 📦 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server + launch Electron with hot reload |
| `npm run build` | Bundle React app with TypeScript compilation |
| `npm run dist` | Full build: compile → bundle → package Windows .exe |

## 🎮 Game Mechanics

**Goal:** Earn credits to pay off your ¥1200 debt before time runs out.

### Core Systems

- **JobSystem** - Accept contracts with varying difficulty and payouts
- **CombatSystem** - Execute jobs with success chance based on your rig and software
- **InventorySystem** - Manage hardware and components you've acquired
- **LocationSystem** - Travel between hideout, market, rooftop, sewers, and black market
- **TradeSystem** - Buy/sell hardware upgrades at different locations
- **HealthSystem** - Cool down your rig or scan for detection
- **DebtSystem** - Make payments toward your debt
- **StatusSystem** - View detailed stats and rig configuration

### Key Stats

- **Heat** (0-100°C) - Thermal buildup from jobs; overheat = instant failure
- **Trace** (0-100%) - Detection level; too high = corporate response
- **Debt** - Outstanding balance (decreases with payments)
- **Rig** - Your custom computer with 6 component slots:
  - CPU (threads determine job success chance)
  - RAM (storage)
  - GPU (hash rate for crypto jobs, generates heat)
  - Network (signal integrity and range)
  - Cooling (heat capacity)
  - Storage (data capacity)

### Commands

```
help              # Show command list
status            # View financial & system status
rig               # Inspect your hardware
jobs              # List available contracts
take <#>          # Accept a job
run               # Execute active job
abort             # Cancel job
shu_run           # Execute a unlisted job
locations         # Show accessible areas
go <location>     # Travel somewhere
shop              # Browse vendor items (at market/black market)
buy <#>           # Purchase equipment
install <#>       # Install item from inventory
inventory         # View carried items
scan              # Network scan (rooftop/sewers only)
cool              # Vent heat manually (costs 1 day)
pay               # Pay debt installment (¥200)
save              # Export game state
load              # Import game state
clear             # Clear terminal
```

## 🏗️ Project Structure

```
junkrunner/
├── src/
│   ├── components/
│   │   ├── Game.tsx           # Main terminal UI component
│   │   └── StatusBar.tsx      # Progress bar component
│   ├── classes/
│   │   ├── GameState.ts       # Immutable state container
│   │   └── GameEngine.ts      # Command processor & system orchestrator
│   ├── systems/               # Business logic modules
│   │   ├── JobSystem.ts
│   │   ├── CombatSystem.ts
│   │   ├── InventorySystem.ts
│   │   ├── LocationSystem.ts
│   │   ├── TradeSystem.ts
│   │   ├── HealthSystem.ts
│   │   ├── DebtSystem.ts
│   │   └── StatusSystem.ts
│   ├── styles/
│   │   ├── Game.css           # Terminal styling
│   │   └── StatusBar.css      # Progress bar styling
│   ├── data/                  # JSON game data
│   │   ├── bootSequence.json  # Boot messages
│   │   ├── initialState.json  # Starting state
│   │   ├── items.json         # Hardware catalog
│   │   ├── jobs.json          # Contract templates
│   │   └── locations.json     # Map data
│   ├── App.tsx                # Root component
│   └── index.tsx              # React entry point
├── electron/
│   ├── main.cjs               # Electron main process
│   ├── main.js                # CommonJS loader
│   └── preload.js             # Security preload script
├── scripts/
│   └── copy-electron.js       # Build helper script
├── index.html                 # HTML template
├── vite.config.ts             # Vite bundler config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies & scripts
```

## 🏛️ Architecture

### Systems-Based Design

The game uses a **systems-based architecture** following CLEAN principles:

- Each system (JobSystem, CombatSystem, etc.) has a single responsibility
- Systems are stateless—they transform GameState immutably
- GameEngine routes commands to appropriate systems
- Zero coupling between systems

**Example:**
```typescript
// JobSystem handles job logic
class JobSystem {
  listJobs(state: GameState): GameState { ... }
  takeJob(state: GameState, idx: number): GameState { ... }
  abortJob(state: GameState): GameState { ... }
}

// GameEngine dispatches commands
processCommand(cmd: string): GameState {
  case 'jobs':
    return this.jobSystem.listJobs(state);
  case 'take':
    return this.jobSystem.takeJob(state, idx);
  // ...
}
```

### Type Safety

- **100% TypeScript** with strict mode enabled
- Interfaces for GameState, Items, Jobs, Locations, etc.
- React components with proper prop typing
- No implicit `any` types

### Immutable State

- GameState uses the immutable update pattern
- All modifications return new GameState instances
- Prevents accidental mutations and bugs

## 🛠️ Development

### Hot Reload

During `npm run dev`:
- Edit React components → auto-reload in Electron
- Edit TypeScript → recompile on save
- Edit CSS → hot update in real-time

### Debugging

Press **F12** in dev mode to open DevTools. Check:
- Console for game logs
- Application tab for saved data
- Network tab for asset loading

### Building for Production

```bash
npm run dist
```

Creates:
- TypeScript compilation (type checking)
- Vite bundling (50 modules → 165 KB gzipped)
- Electron packaging (release/JUNKRUNNER-win32-x64/JUNKRUNNER.exe)

Build time: ~30 seconds on first run, faster on subsequent runs.

## 🎨 UI/UX Features

- **Large, readable fonts** (18px+ for better visibility)
- **Cyberpunk color scheme** (Dracula theme)
- **Live status bars** - Heat, Trace, Debt percentages in header
- **Scrollable terminal** - Auto-scrolls to latest output
- **Command history** - ↑/↓ arrow keys to navigate
- **Color-coded output** - Different colors for input, errors, success, system messages

## 📋 Game Balance

### Job Success Factors

Success chance is calculated from:
- CPU threads (↑ threads = ↑ success)
- Network integrity (↑ integrity = ↑ success)
- GPU presence (↑ hash rate = ↑ success)
- Job difficulty (↑ difficulty = ↓ success)
- Ghost Module software (↓ detection, doesn't affect success)

### Thermal Management

- Most jobs generate 15-50°C depending on difficulty and GPU
- Cooling cap limits max safe heat
- Exceeding cooling cap during job = instant failure
- Venting costs 1 day and ¥0 but requires downtime

### Debt & Reputation

- Debt increases over time (timer-based)
- Each payment = ¥200
- Completing jobs increases reputation
- Higher rep unlocks better jobs

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### TypeScript Errors

Ensure you're using Node 16+:
```bash
node --version  # Should be v16+
npm --version
```

### Electron Won't Launch

- Check if port 5173 is available (dev mode)
- Verify Node.js and npm are in PATH
- Try: `npm install` → `npm run dev`

### Slow Builds

First build is slower (~30s). Subsequent builds cache compiled TypeScript.

## 📦 Build Output

After `npm run dist`:

```
release/
└── JUNKRUNNER-win32-x64/
    ├── JUNKRUNNER.exe      # Standalone portable executable
    ├── resources/          # Game assets and code
    ├── locales/            # Language files
    └── [Electron dependencies]
```

No installation required—just run the .exe.

## 📝 License

[Add your license here]

## 🔗 Links

- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Electron Docs](https://www.electronjs.org/docs)
- [Vite Docs](https://vitejs.dev/)

---

**Made with ☕ and cyberpunk vibes**

