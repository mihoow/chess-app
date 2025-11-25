import type { Color, Coord, GameStatus, Position, Square } from '@chess-app/engine';

export type BoardThemeId = 'classic' | 'forest' | 'dark';

export type BoardTheme = {
  id: BoardThemeId;
  light: string;
  dark: string;
};

export interface IHistory {
  canGoBack: boolean;
  canGoForward: boolean;
  lastMoveCoord: Coord | null;

  goBack(): void;
  goForward(): void;
}

export type GameState = {
  gameStatus: GameStatus;
  winner: Color | null;
  sideToMove: Color;
  board: Array<[Position, Square]>;
  lastMoveCoord: Coord | null;
};
