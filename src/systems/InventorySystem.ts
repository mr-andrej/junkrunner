/**
 * InventorySystem - Handles inventory display and item installation
 */
import type { GameState } from '../classes/GameState';

export class InventorySystem {
  displayInventory(state: GameState): GameState {
    if (state.inventory.length === 0) {
      return state.addLog('Inventory is empty.');
    }

    const items = state.inventory.map(
      (item, idx) => `  [${idx + 1}] ${item.name} [${item.category}]`
    );

    return state.addLogs(
      ['━━━ INVENTORY ━━━', ...items, '━━━━━━━━━━━━━━━━━']
    );
  }

  installItem(state: GameState, itemIdx: number): GameState {
    if (itemIdx < 0 || itemIdx >= state.inventory.length) {
      return state.addLog('Invalid item number.', 'error');
    }

    const item = state.inventory[itemIdx];
    const category = item.category as keyof GameState['rig'];

    // Remove from inventory and install into rig
    const newInventory = state.inventory.filter((_, i) => i !== itemIdx);
    const newRig = { ...state.rig };
    (newRig[category] as any) = { ...item, id: item.id };

    const newState = state.update({
      inventory: newInventory,
      rig: newRig
    });

    return newState.addLog(`Installed: ${item.name} to ${category}`);
  }
}
