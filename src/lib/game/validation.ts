import type { GameSettings, Player } from "@/types/game";
import type { Category } from "@/types/words";
import { categoryHasEnoughWords } from "@/lib/words/wordsRepository";

export interface ValidationError {
  field: string;
  message: string;
}

export function normalizePlayerNames(
  count: number,
  names: string[]
): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    name: names[i]?.trim() || `Игрок ${i + 1}`,
  }));
}

export function validateGameSettings(
  settings: Omit<GameSettings, "players"> & {
    playerCount: number;
    playerNames: string[];
  },
  category: Category | undefined
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (settings.playerCount < 3) {
    errors.push({
      field: "playerCount",
      message: "Минимум 3 игрока",
    });
  }
  if (settings.playerCount > 15) {
    errors.push({
      field: "playerCount",
      message: "Максимум 15 игроков",
    });
  }

  if (settings.spiesCount < 1) {
    errors.push({
      field: "spiesCount",
      message: "Минимум 1 шпион",
    });
  }
  if (settings.spiesCount > 3) {
    errors.push({
      field: "spiesCount",
      message: "Максимум 3 шпиона",
    });
  }

  const civiliansCount = settings.playerCount - settings.spiesCount;
  if (settings.spiesCount >= civiliansCount) {
    errors.push({
      field: "spiesCount",
      message: "Шпионов должно быть меньше, чем обычных игроков",
    });
  }

  if (!settings.categoryId) {
    errors.push({
      field: "categoryId",
      message: "Выберите категорию",
    });
  }

  if (category && !categoryHasEnoughWords(category, settings.mode)) {
    errors.push({
      field: "categoryId",
      message:
        settings.mode === "hardcore"
          ? "В категории нужно минимум 2 слова для хардкор режима"
          : "В категории нет слов",
    });
  }

  return errors;
}

export function getValidationMessage(errors: ValidationError[]): string | null {
  return errors[0]?.message ?? null;
}
