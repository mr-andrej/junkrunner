/**
 * StatusSystem - Handles status displays and rig information
 */
import type { GameState } from '../classes/GameState';

interface Location {
  name: string;
  desc: string;
  signal: number;
}

export class StatusSystem {
  constructor(private locationsData: Record<string, Location>) {}

  displayStatus(state: GameState): GameState {
    const heatRisk = state.getHeatRisk();
    const debtStatus =
      state.debtDays <= 3
        ? '!!CRITICAL!!'
        : state.debtDays <= 7
          ? 'WARNING'
          : 'OK';

    return state.addLogs([
      '━━━ SYSTEM STATUS ━━━',
      `  Location        : ${this.locationsData[state.location]?.name || state.location}`,
      `  Day             : ${state.day}`,
      `  Credits         : ¥${state.credits}`,
      `  Black Credits   : ¥${state.blackCredits} (illegal)`,
      `  Debt Remaining  : ¥${state.debt} [${debtStatus} — ${state.debtDays} days]`,
      `  Heat            : ${state.heat}°C / Cooling cap: ${state.rig.cooling?.capacity || 0}°C`,
      `  Heat Overflow   : ${heatRisk > 0 ? heatRisk + '°C DANGER' : 'STABLE'}`,
      `  Trace Level     : ${state.traceLevel}% ${state.traceLevel > 70 ? '(DETECTED SOON)' : ''}`,
      `  Fixer Rep       : ${state.repFixer} / Black Market Rep: ${state.repBlackMarket}`,
      `  Arasaka Alert   : ${state.arasawaWarning}% ${state.arasawaWarning > 50 ? '— THEY KNOW YOU EXIST' : ''}`,
      `  Active Job      : ${state.activeJob ? state.activeJob.title : 'none'}`,
      `  Software        : ${state.software.join(', ') || 'none'}`
    ]);
  }

  displayRig(state: GameState): GameState {
    const r = state.rig;
    return state.addLogs([
      '━━━ JIG RIG HARDWARE ━━━',
      `  CPU     : ${r.cpu?.name || 'EMPTY'} ${r.cpu ? `[${r.cpu.threads} threads, ${r.cpu.power}W]` : ''}`,
      `  RAM     : ${r.ram?.name || 'EMPTY'} ${r.ram ? `[${r.ram.gb}GB]` : ''}`,
      `  GPU/COP : ${r.gpu?.name || 'none'} ${r.gpu ? `[hash x${r.gpu.hashRate}]` : ''}`,
      `  Network : ${r.network?.name || 'EMPTY'} ${r.network ? `[range ${r.network.range}, integrity ${r.network.integrity}%]` : ''}`,
      `  Cooling : ${r.cooling?.name || 'EMPTY'} ${r.cooling ? `[${r.cooling.capacity}°C cap]` : ''}`,
      `  Storage : ${r.storage?.name || 'EMPTY'} ${r.storage ? `[${r.storage.gb}GB]` : ''}`,
      `  Total Draw: ${(r.cpu?.power || 0) + (r.gpu?.heatMod || 0)}W`
    ]);
  }
}
