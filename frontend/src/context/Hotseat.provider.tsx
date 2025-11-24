/* eslint-disable react-hooks/refs */
import { useRef, type PropsWithChildren, useState } from 'react';
import { GameContext, type MakeMoveResult } from './Game.context';
import { Game, type Coord } from '@chess-app/engine';
import type { GameState } from '../type';
import { useBoardTheme } from '../hooks/useBoardTheme';

function useGame() {
  const gameRef = useRef<Game | null>(null);

  return {
    current: () => {
      if (!gameRef.current) {
        gameRef.current = new Game();
      }

      return gameRef.current;
    },
    reset: () => {
      gameRef.current = new Game();

      return gameRef.current;
    },
  };
}

export function HotseatProvider({ children }: PropsWithChildren) {
  const gameRef = useGame();

  const [gameState, setGameState] = useState<GameState>(() => {
    const game = gameRef.current();

    return {
      gameStatus: game.status,
      winner: game.winner,
      sideToMove: game.sideToMove,
      board: game.getBoard(),
    };
  });
  const themeHook = useBoardTheme();

  const makeMove = (fromCoord: Coord, toCoord: Coord): MakeMoveResult => {
    const game = gameRef.current();

    try {
      game.makeMove({ from: fromCoord, to: toCoord });

      return {
        ok: true,
        finalize: () =>
          new Promise((resolve) => {
            setGameState({
              gameStatus: game.status,
              winner: game.winner,
              sideToMove: game.sideToMove,
              board: game.getBoard(),
            });

            resolve();
          }),
      };
    } catch (error) {
      console.log('Error: ', error);

      return { ok: false };
    }
  };

  const reset = () => {
    const newGame = gameRef.reset();

    setGameState({
      gameStatus: newGame.status,
      winner: newGame.winner,
      sideToMove: newGame.sideToMove,
      board: newGame.getBoard(),
    });
  };

  return (
    <GameContext.Provider
      value={{
        ...gameState,

        makeMove,
        reset,

        ...themeHook,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
