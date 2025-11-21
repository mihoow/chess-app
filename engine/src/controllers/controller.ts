import { GameResult } from './game-result';
import { Ply } from './ply';
import { MovePayload } from '../types';
import { EnPassant } from './en-passant';
import { Board } from './board';
import { CastlingRights } from './castling-rights';
import { PossibleMoves } from '../utils/possible-moves';
import { IllegalMoveException } from '../utils';

interface IController {
  board: Board;
  ply: Ply;
  gameResult: GameResult;
  castlingRights: CastlingRights;
  enPassant: EnPassant;
}

export class Controller implements IController {
  readonly board: Board;
  readonly ply: Ply;
  readonly gameResult: GameResult;
  readonly castlingRights: CastlingRights;
  readonly enPassant: EnPassant;

  static fromFEN(fen: string) {
    const [piecePlacement, sideLetter, castlingRights, enPassantTargetSquare, halfMoveClock, fullMoveNo] =
      fen.split(/\s/);

    const board = Board.fromFEN(piecePlacement);

    return new this({
      board,
      enPassant: EnPassant.fromFEN(enPassantTargetSquare),
      ply: Ply.fromFEN(sideLetter, fullMoveNo),
      gameResult: GameResult.fromFEN(halfMoveClock, board),
      castlingRights: CastlingRights.fromFEN(castlingRights),
    });
  }

  constructor({ board, enPassant, ply, gameResult, castlingRights }: IController) {
    this.board = board;
    this.enPassant = enPassant;
    this.ply = ply;
    this.gameResult = gameResult;
    this.castlingRights = castlingRights;
  }

  makeMove(payload: MovePayload): Controller {
    const possibleMoves = new PossibleMoves(this, { side: this.ply.sideToMove });
    const move = possibleMoves.findMove(payload);

    if (!move) throw new IllegalMoveException(`Move not allowed: ${payload}`);

    const nextBoard = this.board.afterMove(move);
    const nextGameResult = this.gameResult.afterMove(move, this, nextBoard);
    const nextCastlingRights = this.castlingRights.afterMove(move, this, nextBoard);
    const nextEnPassant = this.enPassant.afterMove(move, this, nextBoard);
    const nextPly = this.ply.afterMove();

    return new Controller({
      board: nextBoard,
      enPassant: nextEnPassant,
      ply: nextPly,
      gameResult: nextGameResult,
      castlingRights: nextCastlingRights,
    });
  }

  getFEN(): string {
    return [
      this.board.toFEN(),
      this.ply.sideToMove[0],
      this.castlingRights.toFEN(),
      this.enPassant.toFEN,
      this.gameResult.halfMoveClock,
      this.ply.fullMove,
    ].join(' ');
  }
}
