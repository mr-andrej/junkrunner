/**
 * InventorySystem - Handles inventory display and item installation
 */
import type { GameState, Item } from "../classes/GameState";

export class InventorySystem {
  displayInventory(state: GameState): GameState {
    if (state.inventory.length === 0) {
      return state.addLog("Inventory is empty.");
    }

    const items = state.inventory.map(
      (item, idx) => `  [${idx + 1}] ${item.name} [${item.category}]`,
    );

    return state.addLogs(["━━━ INVENTORY ━━━", ...items, "━━━━━━━━━━━━━━━━━"]);
  }

  installItem(state: GameState, itemIdx: number): GameState {
    if (isNaN(itemIdx) || itemIdx < 0 || itemIdx >= state.inventory.length) {
      return state.addLog("Invalid item number.", "error");
    }

    const item = state.inventory[itemIdx];
    const newInventory = state.inventory.filter((_, i) => i !== itemIdx);

    // Software is not a rig component; it goes to the software list
    if (item.category === "software") {
      const filename = item.filename || item.id;

      if (state.software.includes(filename)) {
        return state.addLog(`${item.name} is already installed.`, "error");
      }

      return state
        .update({
          inventory: newInventory,
          software: [...state.software, filename],
        })
        .addLog(`Installed software: ${filename}`);
    }

    const category = item.category as keyof GameState["rig"];

    // items.json nests stats under "stats"; flatten so rig stat lookups work
    const installed: Item = { ...item, ...(item.stats || {}) };
    delete installed.stats;

    // Replaced component goes back to inventory instead of vanishing
    const replaced = state.rig[category];
    if (replaced) {
      newInventory.push(replaced);
    }

    const newRig = { ...state.rig };
    (newRig[category] as any) = installed;

    const newState = state.update({
      inventory: newInventory,
      rig: newRig,
    });

    return newState.addLog(
      `Installed: ${item.name} to ${category}` +
        (replaced ? ` (replaced ${replaced.name})` : ""),
    );
  }
}
