import type { GameState as GameStateType, Job } from "./GameState";
import locationsData from "../data/locations.json";
import itemsData from "../data/items.json";
import jobsData from "../data/jobs.json";
import { JobSystem } from "../systems/JobSystem";
import { CombatSystem } from "../systems/CombatSystem";
import { InventorySystem } from "../systems/InventorySystem";
import { LocationSystem } from "../systems/LocationSystem";
import { TradeSystem } from "../systems/TradeSystem";
import { HealthSystem } from "../systems/HealthSystem";
import { DebtSystem } from "../systems/DebtSystem";
import { StatusSystem } from "../systems/StatusSystem";

/**
 * GameEngine - Routes commands to appropriate systems
 */
export class GameEngine {
  state: GameStateType;
  locations: Record<string, any>;
  items: any;
  jobs: Job[];
  jobSystem: JobSystem;
  combatSystem: CombatSystem;
  inventorySystem: InventorySystem;
  locationSystem: LocationSystem;
  tradeSystem: TradeSystem;
  healthSystem: HealthSystem;
  debtSystem: DebtSystem;
  statusSystem: StatusSystem;

  constructor(state: GameStateType) {
    this.state = state;
    this.locations = locationsData;
    this.items = itemsData;
    this.jobs = jobsData;

    // Initialize all systems
    this.jobSystem = new JobSystem(jobsData);
    this.combatSystem = new CombatSystem(this.jobSystem);
    this.inventorySystem = new InventorySystem();
    this.locationSystem = new LocationSystem(locationsData);
    this.tradeSystem = new TradeSystem(itemsData, locationsData);
    this.healthSystem = new HealthSystem();
    this.debtSystem = new DebtSystem();
    this.statusSystem = new StatusSystem(locationsData);
  }

  // Process a command and return updated state
  processCommand(cmd: string): GameStateType {
    let state = this.state;
    const parts = cmd.trim().split(/\s+/);
    const verb = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    // Log the command
    state = state.addLog(`> ${cmd}`, "input");


    // TODO: Handle the help command better, there should probably be a .json with possible commands with a description instead of
    // having this list hardcoded
    switch (verb) {
      case "help":
        return state.addLogs([
          "━━━ JUNKRUNNER COMMANDS ━━━",
          "  status          -- System + financial overview",
          "  rig             -- Current hardware config",
          "  inventory       -- Items you're carrying",
          "  jobs            -- Available contracts",
          "  take <job#>     -- Accept a job",
          "  run             -- Execute active job",
          "  shu_run         -- Execute a unlisted job",
          "  abort           -- Cancel active job",
          "  go <location>   -- Move to a location",
          "  locations       -- List accessible locations",
          "  shop            -- Browse local vendor (if at market/black bazaar)",
          "  buy <item#>     -- Purchase an item",
          "  install <item#> -- Install item from inventory",
          "  scan            -- Passive network scan (at rooftop/sewers)",
          "  cool            -- Vent heat manually (costs time)",
          "  pay             -- Pay debt installment (200 credits)",
          "  save            -- Export save file",
          "  load            -- Import save file",
          "  clear           -- Clear terminal",
          "  help            -- This menu",
          "━━━━━━━━━━━━━━━━━━━━━━━━━",
        ]);

      case "status":
        return this.statusSystem.displayStatus(state);

      case "rig":
        return this.statusSystem.displayRig(state);

      case "inventory":
        return this.inventorySystem.displayInventory(state);

      case "locations":
        return this.locationSystem.listLocations(state);

      case "go":
        return this.locationSystem.travel(state, args[0]);

      case "jobs":
        return this.jobSystem.listJobs(state);

      case "take":
        return this.jobSystem.takeJob(state, parseInt(args[0]) - 1);

      case "run":
        return this.combatSystem.executeJob(state);

      case "shu_run":
        return this.combatSystem.executeJob(state, true);

      case "abort":
        return this.jobSystem.abortJob(state);

      case "shop":
        return this.tradeSystem.displayShop(state);

      case "buy":
        return this.tradeSystem.buyItem(state, parseInt(args[0]) - 1);

      case "install":
        return this.inventorySystem.installItem(state, parseInt(args[0]) - 1);

      case "scan":
        return this.healthSystem.scan(state, this.locationSystem);

      case "cool":
        return this.healthSystem.cool(state);

      case "pay":
        return this.debtSystem.pay(state);

      case "save":
        return this.handleSave(state);

      case "load":
        return this.handleLoad(state);

      case "clear":
        return state.update({ log: [] });

      default:
        if (cmd.trim() === "") {
          return state;
        }
        return state.addLog(
          `Command not found: "${verb}". Type "help" for commands.`,
          "error",
        );
    }
  }

  private handleSave(state: GameStateType): GameStateType {
    const saveData = JSON.stringify(state.toJSON(), null, 2);
    return state.addLog(`[Save game data to clipboard]\n${saveData}`);
  }

  private handleLoad(state: GameStateType): GameStateType {
    return state.addLog(
      "Paste save data and reload. (Future: implement paste detection)",
    );
  }
}
