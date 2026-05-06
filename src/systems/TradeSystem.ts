/**
 * TradeSystem - Handles shops and buying items
 */
import type { GameState, Item } from '../classes/GameState';

interface ItemsData {
  components: Record<string, Item[]>;
  software: Item[];
}

interface Location {
  name: string;
  desc: string;
  signal: number;
}

export class TradeSystem {
  constructor(private itemsData: ItemsData, private locationsData: Record<string, Location>) {}

  getShopItems(location: string): Item[] {
    if (location === 'market') {
      return this.itemsData.components.cpu
        .concat(this.itemsData.components.ram)
        .concat(this.itemsData.components.network)
        .concat(this.itemsData.components.cooling)
        .concat(this.itemsData.components.storage)
        .filter(item => item.rarity !== 'epic');
    } else if (location === 'blackmarket') {
      return this.itemsData.components.gpu
        .concat(this.itemsData.software);
    }
    return [];
  }

  displayShop(state: GameState): GameState {
    const items = this.getShopItems(state.location);

    if (!items || items.length === 0) {
      return state.addLog(
        `No shop available at ${this.locationsData[state.location]?.name}.`,
        'error'
      );
    }

    const itemsList = items.map(
      (item, idx) =>
        `[${idx + 1}] ${item.name} [${item.rarity}] - ¥${item.price}\n    ${item.desc}`
    );

    return state.addLogs([
      '━━━ AVAILABLE ITEMS ━━━',
      ...itemsList,
      'Use "buy <number>" to purchase'
    ]);
  }

  buyItem(state: GameState, itemIdx: number): GameState {
    const items = this.getShopItems(state.location);

    if (!items || itemIdx < 0 || itemIdx >= items.length) {
      return state.addLog('Invalid item number.', 'error');
    }

    const item = items[itemIdx];
    const canAfford = state.credits >= (item.price || 0);

    if (!canAfford) {
      return state.addLog(
        `Insufficient funds. Need ¥${item.price}, have ¥${state.credits}.`,
        'error'
      );
    }

    const newState = state.update({
      credits: state.credits - (item.price || 0),
      inventory: [...state.inventory, item]
    });

    return newState.addLog(`Purchased: ${item.name}`);
  }
}
