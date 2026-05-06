import { useState, useEffect, useRef, useCallback } from "react";
import { GameState, LogEntry } from "../classes/GameState";
import { GameEngine } from "../classes/GameEngine";
import { StatusBar } from "./StatusBar";
import bootSequenceData from "../data/bootSequence.json";
import initialStateData from "../data/initialState.json";
import "../styles/Game.css";

function lineColor(type: LogEntry["type"]): string {
  switch (type) {
    case "input":
      return "#7dff9e";
    case "error":
      return "#ff5555";
    case "warn":
      return "#ffb86c";
    case "success":
      return "#50fa7b";
    case "system":
      return "#8be9fd";
    default:
      return "#cdd6f4";
  }
}

export default function JunkRunner() {
  // Initialize state with boot sequence
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState = new GameState({
      ...initialStateData,
      log: bootSequenceData.map((line: string, i: number) => ({
        id: i,
        text: line,
        type: "system" as const,
      })),
    } as any);
    return initialState;
  });

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize game engine
  const engine = new GameEngine(gameState);

  // Boot animation
  useEffect(() => {
    const timer = setTimeout(() => {}, 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [gameState.log]);

  const processCommand = useCallback(
    (cmd: string) => {
      const newState = engine.processCommand(cmd);
      setGameState(newState);
    },
    [engine],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      const cmd = input.trim();
      if (cmd) {
        setHistory((h) => [cmd, ...h.slice(0, 49)]);
        setHistoryIdx(-1);
        processCommand(cmd);
      }
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(newIdx);
      setInput(history[newIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const newIdx = historyIdx - 1;
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput("");
      }
    }
  };

  const gs = gameState;
  const heatPct = gs.heat;
  const tracePct = gs.traceLevel;
  //const debtPct = gs.getDebtPercentage();
  const debtRemaining = gs.getDebt();

  return (
    <div className="terminal">
      {/* Header bar */}
      <div className="terminal__header">
        <span className="terminal__title">JUNKRUNNER</span>
        <span className="terminal__day">DAY {gs.day}</span>
        <StatusBar
          label="HEAT"
          value={heatPct}
          max={100}
          color={
            heatPct > 70 ? "#ff5555" : heatPct > 40 ? "#ffb86c" : "#50fa7b"
          }
        />
        <StatusBar
          label="TRACE"
          value={tracePct}
          max={100}
          color={
            tracePct > 70 ? "#ff5555" : tracePct > 40 ? "#ffb86c" : "#8be9fd"
          }
        />
        <StatusBar
          label="DEBT"
          value={debtRemaining}
          max={initialStateData.initialDebt}
          color={debtRemaining > 600 ? "#ff5555" : "#bd93f9"}
          isPercentage={false}
          customPrefix="¥"
        />
        <span className="terminal__credits">
          ¥{gs.credits} | B¥{gs.blackCredits}
        </span>
        <span className="terminal__location">
          {engine.locations[gs.location]?.name}
        </span>
      </div>

      {/* Terminal output */}
      <div
        ref={logRef}
        onClick={() => inputRef.current?.focus()}
        className="terminal__output"
      >
        {gameState.log.map((line: LogEntry) => (
          <div
            key={line.id}
            className="terminal__line"
            style={{ color: lineColor(line.type) }}
          >
            {line.text || "\u00A0"}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="terminal__input-area">
        <span className="terminal__prompt">{gs.location}@ghost:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck="false"
          autoComplete="off"
          className="terminal__input"
          placeholder="type a command..."
        />
      </div>
    </div>
  );
}
