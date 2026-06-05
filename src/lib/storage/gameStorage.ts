import type { ActiveGameState } from "@/types/game";
import {
  GAME_STORAGE_KEY,
  getItem,
  removeItem,
  setItem,
} from "@/lib/storage/localStorage";

export function loadActiveGame(): ActiveGameState | null {
  return getItem<ActiveGameState>(GAME_STORAGE_KEY);
}

export function saveActiveGame(state: ActiveGameState): void {
  setItem(GAME_STORAGE_KEY, state);
}

export function clearActiveGame(): void {
  removeItem(GAME_STORAGE_KEY);
}
