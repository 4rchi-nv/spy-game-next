import type {
  GameCard,
  GameMode,
  GameSettings,
  GeneratedGame,
  Player,
  Role,
} from "@/types/game";
import type { Category } from "@/types/words";

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandomWord(words: string[], exclude: string[] = []): string {
  const available = words.filter((w) => !exclude.includes(w));
  if (!available.length) {
    throw new Error("Not enough words in category");
  }
  return available[Math.floor(Math.random() * available.length)];
}

function pickTwoDifferentWords(words: string[]): [string, string] {
  if (words.length < 2) {
    throw new Error("Need at least 2 words for hardcore mode");
  }
  const mainWord = pickRandomWord(words);
  const spyWord = pickRandomWord(words, [mainWord]);
  return [mainWord, spyWord];
}

function assignSpyRoles(players: Player[], spiesCount: number): Map<string, Role> {
  const shuffled = shuffle(players);
  const roles = new Map<string, Role>();
  shuffled.forEach((player, index) => {
    roles.set(player.id, index < spiesCount ? "spy" : "civilian");
  });
  return roles;
}

function buildCards(
  players: Player[],
  roles: Map<string, Role>,
  mode: GameMode,
  mainWord: string,
  spyWord: string | null
): GameCard[] {
  return players.map((player) => {
    const role = roles.get(player.id)!;
    let word: string;

    if (mode === "classic") {
      word = role === "spy" ? "__SPY__" : mainWord;
    } else {
      word = role === "spy" ? (spyWord ?? mainWord) : mainWord;
    }

    return {
      playerId: player.id,
      playerName: player.name,
      role,
      word,
    };
  });
}

export function generateGame(
  settings: GameSettings,
  category: Category
): GeneratedGame {
  const shuffledPlayers = shuffle(settings.players);
  const roles = assignSpyRoles(shuffledPlayers, settings.spiesCount);

  let mainWord: string;
  let spyWord: string | null = null;

  if (settings.mode === "classic") {
    mainWord = pickRandomWord(category.words);
  } else {
    [mainWord, spyWord] = pickTwoDifferentWords(category.words);
  }

  const cards = buildCards(
    shuffledPlayers,
    roles,
    settings.mode,
    mainWord,
    spyWord
  );

  return {
    settings: { ...settings, players: shuffledPlayers },
    categoryName: category.name,
    mainWord,
    spyWord,
    cards,
    createdAt: Date.now(),
  };
}

export function getCardDisplayText(
  card: GameCard,
  mode: GameMode
): string {
  if (mode === "classic" && card.word === "__SPY__") {
    return "Ты шпион";
  }
  return card.word;
}

export function getSpiesFromGame(game: GeneratedGame): GameCard[] {
  return game.cards.filter((c) => c.role === "spy");
}

export function getModeLabel(mode: GameMode): string {
  return mode === "classic" ? "Обычный" : "Хардкор";
}
