/**
 * DebtSystem - Handles debt management and payments
 */
import type { GameState } from "../classes/GameState";

export class DebtSystem {
  pay(state: GameState): GameState {
    const payment = Math.min(200, state.debt);

    if (payment <= 0) {
      return state.addLog("Debt already paid off.");
    }

    // Black credits work too — the loan shark doesn't ask questions
    const useBlack = state.credits < payment;
    const balance = useBlack ? state.blackCredits : state.credits;

    if (balance < payment) {
      return state.addLog(
        `Insufficient funds. Need ¥${payment}, have ¥${state.credits} + B¥${state.blackCredits}.`,
        "error",
      );
    }

    const newDebt = Math.max(0, state.debt - payment);
    const newDebtDays =
      state.debtDays > 1 ? state.debtDays - 1 : state.debtDays;

    const newState = state.update({
      ...(useBlack
        ? { blackCredits: state.blackCredits - payment }
        : { credits: state.credits - payment }),
      debt: newDebt,
      debtDays: newDebtDays,
    });

    return newState.addLog(
      `Paid ${useBlack ? "B¥" : "¥"}${payment} toward debt. Remaining: ¥${newDebt}`,
    );
  }
}
