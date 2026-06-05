import type { LastGameSettings } from "@/types/game";
import {
  getItem,
  setItem,
  SETTINGS_STORAGE_KEY,
} from "@/lib/storage/localStorage";

export function loadLastSettings(): LastGameSettings | null {
  return getItem<LastGameSettings>(SETTINGS_STORAGE_KEY);
}

export function saveLastSettings(settings: LastGameSettings): void {
  setItem(SETTINGS_STORAGE_KEY, settings);
}
