/**
 * JobSystem - Handles job listing, acceptance, and abortion
 */
import type { GameState, Job } from "../classes/GameState";

export class JobSystem {
  constructor(private jobsData: Job[]) {}

  getAvailableJobs(state: GameState): Job[] {
    return this.jobsData.filter(
      (j) =>
        !state.completedJobs.includes(j.id) &&
        j.id !== state.activeJob?.id &&
        (j as any).minRep <= state.repFixer,
    );
  }

  getAmountOfRemainingJobs(state: GameState): number {
    const remainingJobs: number = this.jobsData.filter(
      (j) =>
        !state.completedJobs.includes(j.id) && j.id !== state.activeJob?.id,
    ).length;

    return remainingJobs;
  }

  getRandomisedJob(): Job {
    const randomIndex = Math.floor(Math.random() * this.jobsData.length);
    const base = this.jobsData[randomIndex];

    // Copy the job so the shared jobs data is never mutated
    return {
      ...base,
      id: `${base.id}_shfld_${Math.random().toString(36).slice(2, 8)}`,
      reward: Math.round(base.reward * (Math.random() + 1)),
      blackReward: Math.round(base.blackReward * (Math.random() + 1)),
      timeLimit: Math.round(base.timeLimit * (Math.random() + 0.8)),
      traceRisk: Math.round(base.traceRisk * (Math.random() + 0.8)),
    };
  }

  listJobs(state: GameState): GameState {
    const available = this.getAvailableJobs(state);

    if (available.length === 0) {
      return state.addLog("No jobs available. Increase your reputation.");
    }

    const jobsList = available.map((job, idx) => [
      `[${idx + 1}] ${job.title} [${job.type.toUpperCase()}]`,
      `    Difficulty: ${job.difficulty}/5 | Reward: ¥${job.reward} (Black: ¥${job.blackReward})`,
      `    ${job.desc}`,
    ]);

    return state.addLogs([
      "━━━ AVAILABLE CONTRACTS ━━━",
      ...jobsList.flat(),
      'Use "take <number>" to accept a job',
    ]);
  }

  takeJob(state: GameState, jobIdx: number): GameState {
    const available = this.getAvailableJobs(state);

    if (isNaN(jobIdx) || jobIdx < 0 || jobIdx >= available.length) {
      return state.addLog("Invalid job number.", "error");
    }

    const job = available[jobIdx];
    const newState = state.update({ activeJob: job });

    return newState.addLogs([
      `Job accepted: ${job.title}`,
      job.desc,
      `Time limit: ${job.timeLimit} days | Trace risk: ${job.traceRisk}%`,
    ]);
  }

  abortJob(state: GameState): GameState {
    if (!state.activeJob) {
      return state.addLog("No active job to abort.", "error");
    }

    return state.update({ activeJob: null }).addLog("Job aborted.");
  }
}
