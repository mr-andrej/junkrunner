/**
 * GameState - Manages all game state immutably
 */

export interface LogEntry {
  id: number;
  text: string;
  type: "input" | "error" | "warn" | "success" | "system" | "output";
}

export interface Item {
  id: string;
  name: string;
  category: string;
  rarity?: string;
  price?: number;
  desc?: string;
  threads?: number;
  power?: number;
  gb?: number;
  hashRate?: number;
  heatMod?: number;
  range?: number;
  integrity?: number;
  capacity?: number;
  spoof?: boolean;
  filename?: string;
  // items.json nests purchasable item stats here; flattened on install
  stats?: Record<string, any>;
}

interface Rig {
  cpu?: Item | null;
  ram?: Item | null;
  gpu?: Item | null;
  network?: Item | null;
  cooling?: Item | null;
  storage?: Item | null;
}

export interface Job {
  id: string;
  title: string;
  desc: string;
  type: string;
  difficulty: number;
  reward: number;
  blackReward: number;
  traceRisk: number;
  timeLimit: number;
  software?: string | null;
}

interface RigStats {
  totalPower: number;
  totalThreads: number;
  totalRAM: number;
  totalStorage: number;
  networkRange: number;
  networkIntegrity: number;
  coolingCapacity: number;
  hasGPU: boolean;
  isSpoofed: boolean;
}

export interface GameStateData {
  credits: number;
  blackCredits: number;
  debt: number;
  debtDays: number;
  heat: number;
  traceLevel: number;
  day: number;
  location: string;
  rig: Rig;
  inventory: Item[];
  log: LogEntry[];
  software: string[];
  activeJob: Job | null;
  completedJobs: string[];
  repFixer: number;
  repBlackMarket: number;
  arasawaWarning: number;
}

export class GameState implements GameStateData {
  credits!: number;
  blackCredits!: number;
  debt!: number;
  debtDays!: number;
  heat!: number;
  traceLevel!: number;
  day!: number;
  location!: string;
  rig!: Rig;
  inventory!: Item[];
  log!: LogEntry[];
  software!: string[];
  activeJob!: Job | null;
  completedJobs!: string[];
  repFixer!: number;
  repBlackMarket!: number;
  arasawaWarning!: number;

  constructor(data: GameStateData) {
    Object.assign(this, data);
  }

  // Create a copy with updates
  update(changes: Partial<GameStateData>): GameState {
    return new GameState({ ...this, ...changes });
  }

  // Create a copy with nested updates (e.g., rig.cpu)
  updateNested(path: string, changes: Partial<Item>): GameState {
    const keys = path.split(".");
    const newState = { ...this };
    let current: any = newState;

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    current[lastKey] = { ...current[lastKey], ...changes };

    return new GameState(newState as GameStateData);
  }

  // Immutably add to log
  addLog(text: string, type: LogEntry["type"] = "output"): GameState {
    return this.update({
      log: [...this.log, { id: Date.now(), text, type }],
    });
  }

  // Immutably add multiple log entries
  addLogs(entries: (string | LogEntry)[]): GameState {
    const timestamp = Date.now();
    const newEntries: LogEntry[] = entries.map((entry, i) => ({
      id: timestamp + i,
      text: typeof entry === "string" ? entry : entry.text,
      type: typeof entry === "string" ? "output" : entry.type,
    }));

    return this.update({
      log: [...this.log, ...newEntries],
    });
  }

  // Get current rig stats
  getRigStats(): RigStats {
    return {
      totalPower: (this.rig.cpu?.power || 0) + (this.rig.gpu?.heatMod || 0),
      totalThreads: this.rig.cpu?.threads || 1,
      totalRAM: this.rig.ram?.gb || 0,
      totalStorage: this.rig.storage?.gb || 0,
      networkRange: this.rig.network?.range || 0,
      networkIntegrity: this.rig.network?.integrity || 0,
      coolingCapacity: this.rig.cooling?.capacity || 0,
      hasGPU: !!this.rig.gpu,
      isSpoofed: !!this.rig.network?.spoof,
    };
  }

  // Calculate heat risk
  getHeatRisk(): number {
    return Math.max(0, this.heat - (this.rig.cooling?.capacity || 0));
  }

  // Calculate debt percentage
  getDebtPercentage(): number {
    return Math.round((this.debt / 1200) * 100);
  }

  // Get the remaining debt in ¥
  getDebt(): number {
    return this.debt;
  }

  // Export for save file
  toJSON(): Omit<GameStateData, "log"> {
    const { log, ...rest } = this;
    return rest; // Don't save log to keep file small
  }
}
