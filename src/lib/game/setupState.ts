import type { LastGameSettings } from "@/types/game";
import type { GameMode } from "@/types/game";

export interface SetupFormState {
  mode: GameMode;
  playerCount: number;
  spiesCount: number;
  categoryId: string;
  timerMinutes: 0 | 3 | 5 | 10;
  playerNames: string[];
}

const DEFAULT_SETUP: SetupFormState = {
  mode: "classic",
  playerCount: 4,
  spiesCount: 1,
  categoryId: "",
  timerMinutes: 5,
  playerNames: ["", "", "", ""],
};

export function getInitialSetupState(): SetupFormState {
  if (typeof window === "undefined") return DEFAULT_SETUP;

  const last = loadLastSettingsFromStorage();
  if (!last) return DEFAULT_SETUP;

  return {
    mode: last.mode,
    playerCount: last.playerCount,
    spiesCount: last.spiesCount,
    categoryId: last.categoryId,
    timerMinutes: last.timerMinutes,
    playerNames: Array.from(
      { length: last.playerCount },
      (_, i) => last.playerNames[i] ?? ""
    ),
  };
}

function loadLastSettingsFromStorage(): LastGameSettings | null {
  try {
    const raw = localStorage.getItem("spy-game-last-settings");
    if (!raw) return null;
    return JSON.parse(raw) as LastGameSettings;
  } catch {
    return null;
  }
}

export function resizePlayerNames(
  names: string[],
  count: number
): string[] {
  if (names.length === count) return names;
  if (names.length < count) {
    return [...names, ...Array(count - names.length).fill("")];
  }
  return names.slice(0, count);
}

export function resolveCategoryId(
  categoryId: string,
  availableIds: string[]
): string {
  if (categoryId && availableIds.includes(categoryId)) return categoryId;
  return availableIds[0] ?? "";
}
