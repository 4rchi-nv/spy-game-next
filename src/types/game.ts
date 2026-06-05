export type GameMode = "classic" | "hardcore";

export type Role = "civilian" | "spy";

export interface Player {
  id: string;
  name: string;
}

export interface GameSettings {
  mode: GameMode;
  players: Player[];
  spiesCount: number;
  categoryId: string;
  timerMinutes: 0 | 3 | 5 | 10;
}

export interface GameCard {
  playerId: string;
  playerName: string;
  role: Role;
  word: string;
}

export interface GeneratedGame {
  settings: GameSettings;
  categoryName: string;
  mainWord: string;
  spyWord: string | null;
  cards: GameCard[];
  createdAt: number;
}

export type GamePhase =
  | "setup"
  | "dealing"
  | "discussion"
  | "voting"
  | "results";

export interface ActiveGameState {
  game: GeneratedGame;
  phase: GamePhase;
  currentCardIndex: number;
  cardRevealed: boolean;
  votedPlayerId: string | null;
}

export interface LastGameSettings {
  mode: GameMode;
  playerCount: number;
  spiesCount: number;
  categoryId: string;
  timerMinutes: 0 | 3 | 5 | 10;
  playerNames: string[];
}
