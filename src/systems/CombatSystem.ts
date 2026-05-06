/**
 * CombatSystem - Handles job execution, success calculation, and rewards
 */
import type { GameState } from "../classes/GameState";
import { JobSystem } from "./JobSystem";
import type { Job } from "../classes/GameState";

export class CombatSystem {
  constructor(private jobSystem: JobSystem) {}

  executeJob(state: GameState, shuffled: boolean = false): GameState {
    let job: Job;

    if (shuffled) {
      job = this.jobSystem.getRandomisedJob();
    } else if (!state.activeJob) {
      return state.addLog(
        'No active job. Use "take <#>" to accept one.',
        "error",
      );
    } else {
      job = state.activeJob;
    }

    if (job.software && !state.software.includes(job.software)) {
      return state.addLog(
        `Missing required software: ${job.software}`,
        "error",
      );
    }

    // Calculate success chance
    const stats = state.getRigStats();
    const netIntegrity = stats.networkIntegrity;
    const threads = stats.totalThreads;
    const hasGPU = stats.hasGPU;
    const ghostMod = state.software.includes("ghost_module.exe") ? -0.35 : 0;
    const spoofed = stats.isSpoofed;

    const successChance = Math.min(
      0.95,
      Math.max(
        0.2,
        0.5 +
          threads * 0.08 +
          netIntegrity / 200 +
          (hasGPU ? 0.15 : 0) -
          job.difficulty * 0.1,
      ),
    );

    const traceAdd = Math.max(
      0,
      job.traceRisk * (1 + ghostMod) * (spoofed ? 0.5 : 1),
    );
    const heatAdd = 15 + job.difficulty * 10 + (hasGPU ? 20 : 0);
    const success = Math.random() < successChance;
    const newHeat = Math.min(100, state.heat + heatAdd);
    const newTrace = Math.min(100, state.traceLevel + traceAdd);

    let newState = state.addLogs([
      `Executing: ${job.title}`,
      "Initiating connection sequence...",
      `  Signal integrity: ${netIntegrity}%`,
      `  Threads active: ${threads}`,
      `  Trace accumulation: +${Math.round(traceAdd)}%`,
      `  Heat generated: +${heatAdd}°C`,
    ]);

    if (newHeat >= 100) {
      newState = newState.update({
        heat: 100,
        traceLevel: newTrace,
        completedJobs: [...state.completedJobs, job.id],
        activeJob: null,
      });
      return newState.addLogs([
        "",
        "⚠️  CRITICAL HEAT ALERT",
        "Your rig just thermally failed mid-job.",
        "The trace burned out with your hardware.",
        "Insurance claim: NO",
        "",
      ]);
    }

    if (success) {
      const reward = job.reward || job.blackReward;
      const isBlack = job.reward === 0;
      const credKey = (isBlack ? "blackCredits" : "credits") as keyof GameState;
      const repKey = (
        isBlack ? "repBlackMarket" : "repFixer"
      ) as keyof GameState;
      const currentCreds = state[credKey] as number;
      const currentRep = state[repKey] as number;

      newState = newState.update({
        heat: newHeat,
        traceLevel: newTrace,
        [credKey]: currentCreds + reward,
        [repKey]: currentRep + 1,
        activeJob: null,
      } as any);

      // TODO : This might be a bad idea if I want to have stats in the game. Perhaps
      // a unique shuffled ID should be generated in the JobSystem
      if (!shuffled) {
        newState.completedJobs = [...state.completedJobs, job.id];
      } else {
        newState.completedJobs = [...state.completedJobs];
      }

      return newState.addLogs([
        "",
        "✓ JOB SUCCESS",
        `Earned ¥${reward} ${isBlack ? "(BLACK)" : ""}`,
        `Rep increased: ${repKey}`,
        "",
      ]);
    } else {
      newState = newState.update({
        heat: newHeat,
        traceLevel: newTrace,
        activeJob: null,
      });

      return newState.addLogs([
        "",
        "✗ JOB FAILED",
        "Connection dropped. Security ICE detected you.",
        "No reward earned.",
        "",
      ]);
    }
  }
}
