/**
 * LocationSystem - Handles location management and travel
 */
import type { GameState } from '../classes/GameState';

interface Location {
  name: string;
  desc: string;
  signal: number;
  detectionMod?: number;
}

export class LocationSystem {
  constructor(private locationsData: Record<string, Location>) {}

  listLocations(state: GameState): GameState {
    const locations = Object.entries(this.locationsData).map(
      ([key, loc]) => `  ${key.padEnd(15)} : ${loc.name} - ${loc.desc}`
    );

    return state.addLogs([
      '━━━ ACCESSIBLE LOCATIONS ━━━',
      ...locations,
      'Use "go <name>" to travel. Costs 1 day.'
    ]);
  }

  travel(state: GameState, destination: string | undefined): GameState {
    if (!destination) {
      return state.addLog('Usage: go <location>', 'error');
    }

    const locKey = Object.keys(this.locationsData).find(
      k => k.toLowerCase().startsWith(destination.toLowerCase())
    );

    if (!locKey) {
      return state.addLog(`Location not found: ${destination}`, 'error');
    }

    const loc = this.locationsData[locKey];
    const newState = state.update({
      location: locKey,
      day: state.day + 1,
      traceLevel: Math.min(100, state.traceLevel + loc.signal)
    });

    return newState.addLogs([
      `Traveling to ${loc.name}...`,
      loc.desc,
      `Signal change: ${loc.signal >= 0 ? '+' : ''}${loc.signal}`
    ]);
  }

  getLocationInfo(locationKey: string): Location | undefined {
    return this.locationsData[locationKey];
  }
}
