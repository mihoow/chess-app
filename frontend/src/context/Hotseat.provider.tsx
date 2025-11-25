/* eslint-disable react-hooks/refs */
import { useRef, type PropsWithChildren, useState } from 'react';
import { GameContext, type MakeMoveResult } from './Game.context';
import {
  Game,
  type Coord,
  ChessException,
  Piece,
  type AdvancesTo,
  MissingPawnPromotionChoiceException,
} from '@chess-app/engine';
import type { GameState } from '../type';
import { useBoardTheme } from '../hooks/useBoardTheme';
import { toast } from 'sonner';
import { useHistory, useHistoryApi, type LocalHistory } from '../hooks/useHotSeatHistory';
import { PawnPromotionModal } from '../components/PawnPromotionModal';
import { useWait } from '../hooks/useWait';

function useGame(history?: LocalHistory) {
  const gameRef = useRef<Game | null>(null);

  return {
    current: () => {
      if (!gameRef.current) {
        gameRef.current = new Game(history?.currentFEN);
      }

      return gameRef.current;
    },
    reset: () => {
      gameRef.current = new Game();
      history?.reset();

      return gameRef.current;
    },
    forceState: (FEN: string) => {
      gameRef.current = new Game(FEN);

      return gameRef.current;
    },
  };
}

export function HotseatProvider({ children }: PropsWithChildren) {
  const history = useHistory();
  const gameRef = useGame(history);

  const [gameState, setGameState] = useState<GameState>(() => {
    const game = gameRef.current();

    return {
      gameStatus: game.status,
      winner: game.winner,
      sideToMove: game.sideToMove,
      board: game.getBoard(),
      lastMoveCoord: history.lastMoveCoord,
    };
  });
  const [pawnPromotion, setPawnPromotion] = useState<{ pawn: Piece } | null>(null);

  const themeHook = useBoardTheme();
  const [waitForPawnPromotion, stopWaitingForPawnPromotion] = useWait<AdvancesTo>();

  const handleEngineException = async (err: unknown, fromCoord: Coord, toCoord: Coord): Promise<MakeMoveResult> => {
    if (!ChessException.isException(err)) {
      console.log('Unknown error occurred:', err);
      toast.error('Something went wrong!', {
        description: 'Not sure what happened, but the board spirits seem displeased.',
      });
      return { ok: false };
    }

    switch (err.code) {
      case 'KING_EXPOSED':
        toast.error('Illegal move!', {
          description: "Your king is yelling: 'Don't leave me hanging!' This move would expose him to danger.",
        });
        break;

      case 'GAME_OVER':
        toast.error('Game over!', {
          description: 'This battle has already been decided. Start a new game for a fresh duel!',
        });
        break;

      case 'ILLEGAL_MOVE':
        toast.error('Hmm, not quite!', {
          description: "That piece can't go there. Even the bravest knight has limits!",
        });
        break;

      case 'MISSING_PAWN_PROMOTION_CHOICE':
        {
          setPawnPromotion({ pawn: (err as MissingPawnPromotionChoiceException).pawn });
          const pieceId = await waitForPawnPromotion();

          if (pieceId) {
            return makeMove(fromCoord, toCoord, pieceId);
          }
        }
        break;

      case 'INTERNAL_STATE':
        toast.error('Oops!', {
          description: 'Our chess engine got momentarily confused. Try restarting the game — it usually helps!',
        });
        break;

      default:
        console.log('Unhandled chess exception:', err);
        toast.error('Something went wrong!', {
          description: 'Not sure what happened, but the board spirits seem displeased.',
        });
    }

    return { ok: false };
  };

  const makeMove = (
    fromCoord: Coord,
    toCoord: Coord,
    advancesTo?: AdvancesTo
  ): MakeMoveResult | Promise<MakeMoveResult> => {
    const game = gameRef.current();

    try {
      game.makeMove({ from: fromCoord, to: toCoord, advancesTo });
      history.push(game.getFEN(), toCoord);

      toast.dismiss(); // delete all active toasts

      return {
        ok: true,
        finalize: () =>
          new Promise((resolve) => {
            setGameState({
              gameStatus: game.status,
              winner: game.winner,
              sideToMove: game.sideToMove,
              board: game.getBoard(),
              lastMoveCoord: toCoord,
            });

            resolve();
          }),
      };
    } catch (err) {
      return handleEngineException(err, fromCoord, toCoord);
    }
  };

  const reset = () => {
    const newGame = gameRef.reset();

    setGameState({
      gameStatus: newGame.status,
      winner: newGame.winner,
      sideToMove: newGame.sideToMove,
      board: newGame.getBoard(),
      lastMoveCoord: null,
    });
  };

  const historyAPI = useHistoryApi(history, (fen, lastMoveCoord) => {
    const game = gameRef.forceState(fen);

    setGameState({
      gameStatus: game.status,
      winner: game.winner,
      sideToMove: game.sideToMove,
      board: game.getBoard(),
      lastMoveCoord,
    });
  });

  return (
    <GameContext.Provider
      value={{
        ...gameState,

        makeMove,
        reset,

        ...themeHook,
        history: historyAPI,
      }}
    >
      {children}
      <PawnPromotionModal
        promotedPawn={pawnPromotion?.pawn ?? null}
        onDone={(pieceId) => {
          setPawnPromotion(null);
          stopWaitingForPawnPromotion(pieceId);
        }}
      />
    </GameContext.Provider>
  );
}
