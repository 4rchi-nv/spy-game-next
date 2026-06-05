const WORDS_STORAGE_KEY = "spy-game-words";
const SETTINGS_STORAGE_KEY = "spy-game-last-settings";
const GAME_STORAGE_KEY = "spy-game-active";

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getItem<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

export function removeItem(key: string): void {
  if (!isBrowser()) return;
  localStorage.removeItem(key);
}

export { WORDS_STORAGE_KEY, SETTINGS_STORAGE_KEY, GAME_STORAGE_KEY };
