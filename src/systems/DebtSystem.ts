/**
 * DebtSystem - Handles debt management and payments
 */
import type { GameState } from '../classes/GameState';

export class DebtSystem {
  pay(state: GameState): GameState {
    const payment = 200;

    if (state.credits < payment) {
      return state.addLog(
        `Insufficient funds. Need ¥${payment}, have ¥${state.credits}.`,
        'error'
      );
    }

    const newDebt = Math.max(0, state.debt - payment);
    const newDebtDays = state.debtDays > 1 ? state.debtDays - 1 : state.debtDays;

    const newState = state.update({
      credits: state.credits - payment,
      debt: newDebt,
      debtDays: newDebtDays
    });

    return newState.addLog(
      `Paid ¥${payment} toward debt. Remaining: ¥${newDebt}`
    );
  }
}
