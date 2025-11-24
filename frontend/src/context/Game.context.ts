import { createContext, use } from 'react';
import type { BoardThemeId, GameState, IHistory } from '../type';

export type MakeMoveResult =
  | {
      ok: true;
      finalize(): Promise<void>;
    }
  | {
      ok: false;
    };

export type GameContextType = GameState & {
  themeId: BoardThemeId;
  history?: IHistory;

  makeMove(fromCoord: string, toCoord: string): MakeMoveResult;
  reset(): void;
  changeTheme: (themeId: BoardThemeId) => void;
};

export const GameContext = createContext<GameContextType | null>(null);

export function useGameContext(): GameContextType {
  const ctx = use(GameContext);

  if (!ctx) throw new Error('Game Context not provided!');

  return ctx;
}
