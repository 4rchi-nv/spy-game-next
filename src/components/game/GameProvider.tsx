"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  ActiveGameState,
  GamePhase,
  GameSettings,
  GeneratedGame,
} from "@/types/game";
import type { Category } from "@/types/words";
import { generateGame } from "@/lib/game/engine";
import {
  clearActiveGame,
  loadActiveGame,
  saveActiveGame,
} from "@/lib/storage/gameStorage";
import { saveLastSettings } from "@/lib/storage/settingsStorage";

interface GameContextValue {
  state: ActiveGameState | null;
  isReady: boolean;
  startGame: (settings: GameSettings, category: Category) => void;
  setPhase: (phase: GamePhase) => void;
  revealCard: () => void;
  hideCard: () => void;
  advanceToNextPlayer: () => void;
  setVotedPlayer: (playerId: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function createInitialState(game: GeneratedGame): ActiveGameState {
  return {
    game,
    phase: "dealing",
    currentCardIndex: 0,
    cardRevealed: false,
    votedPlayerId: null,
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ActiveGameState | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Hydrate game state from localStorage after client mount (SSR-safe)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
    setState(loadActiveGame());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (state) saveActiveGame(state);
    else clearActiveGame();
  }, [state, isReady]);

  const startGame = useCallback(
    (settings: GameSettings, category: Category) => {
      const game = generateGame(settings, category);
      setState(createInitialState(game));

      saveLastSettings({
        mode: settings.mode,
        playerCount: settings.players.length,
        spiesCount: settings.spiesCount,
        categoryId: settings.categoryId,
        timerMinutes: settings.timerMinutes,
        playerNames: settings.players.map((p) => p.name),
      });
    },
    []
  );

  const setPhase = useCallback((phase: GamePhase) => {
    setState((prev) => (prev ? { ...prev, phase } : prev));
  }, []);

  const revealCard = useCallback(() => {
    setState((prev) => (prev ? { ...prev, cardRevealed: true } : prev));
  }, []);

  const hideCard = useCallback(() => {
    setState((prev) => (prev ? { ...prev, cardRevealed: false } : prev));
  }, []);

  const advanceToNextPlayer = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentCardIndex: prev.currentCardIndex + 1,
        cardRevealed: false,
      };
    });
  }, []);

  const setVotedPlayer = useCallback((playerId: string) => {
    setState((prev) =>
      prev ? { ...prev, votedPlayerId: playerId } : prev
    );
  }, []);

  const resetGame = useCallback(() => {
    setState(null);
    clearActiveGame();
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        isReady,
        startGame,
        setPhase,
        revealCard,
        hideCard,
        advanceToNextPlayer,
        setVotedPlayer,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
