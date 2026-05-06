/**
 * HealthSystem - Handles heat, cooling, and thermal management
 */
import type { GameState } from '../classes/GameState';
import type { LocationSystem } from './LocationSystem';

export class HealthSystem {
  cool(state: GameState): GameState {
    if (state.heat <= 0) {
      return state.addLog('Already at safe temperature.');
    }

    const newState = state.update({
      heat: Math.max(0, state.heat - 30),
      day: state.day + 1
    });

    return newState.addLog('Venting heat... (consumed 1 day)');
  }

  scan(state: GameState, locationSystem: LocationSystem): GameState {
    const loc = locationSystem.getLocationInfo(state.location);

    if (!loc || (state.location !== 'rooftop' && state.location !== 'sewers')) {
      return state.addLog(
        'Can only scan from rooftop or sewers (good elevation/signal).',
        'error'
      );
    }

    const netIntegrity = state.rig.network?.integrity || 40;
    const detected = Math.random() * 100 < Math.max(20, 100 - netIntegrity);

    let newState = state.update({
      traceLevel: Math.min(100, state.traceLevel + (detected ? 15 : 5))
    });

    const result = detected
      ? 'Scan detected! Trace increased. Get moving.'
      : 'Clean scan. Signal quality good.';

    return newState.addLogs([`Network scan at ${loc.name}:`, result]);
  }
}
