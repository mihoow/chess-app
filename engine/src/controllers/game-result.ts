import { CaptureMove, EnPassantMove, Move, PromotionMove, SimpleMove } from '../moves';
import { King, Pawn } from '../pieces';
import { Color, GameStatus } from '../types';
import { InternalStateException, KingExposedException, Position } from '../utils';
import { PossibleMoves } from '../utils/possible-moves';
import { Board } from './board';
import { Controller } from './controller';

export class GameResult {
  readonly halfMoveClock: number;
  readonly status: GameStatus;
  readonly winner: Color | null;

  static fromFEN(halfMoveClock: string, board: Board) {
    return new this(parseInt(halfMoveClock), board);
  }

  constructor(halfMoveClock: number, board: Board) {
    this.halfMoveClock = halfMoveClock;

    const { status, winner } = this.checkCurrentStatus(board);
    this.status = status;
    this.winner = winner;
  }

  private checkCurrentStatus(_board: Board) {
    // TODO: check for checkmate, stalemate etc.
    return { status: GameStatus.ONGOING, winner: null };
  }

  private isCurrSideKingAttacked(controller: Controller, nextBoard: Board): boolean {
    const currSide = controller.ply.sideToMove;
    const oppositeSideMoves = new PossibleMoves(controller, {
      side: currSide === 'white' ? 'black' : 'white',
    });

    let currSideKingPosition: Position | null = null;
    nextBoard.forEachSquare((position, square) => {
      if (square.piece instanceof King && square.piece.side === currSide) {
        currSideKingPosition = position;
      }
    });

    if (!currSideKingPosition) throw new InternalStateException('Could not find a king on the board!');

    return oppositeSideMoves.getMovesToPosition(currSideKingPosition).length > 0;
  }

  private getHalfMoveClockAfterMove(move: Move) {
    if (
      move instanceof CaptureMove ||
      move instanceof PromotionMove ||
      move instanceof EnPassantMove ||
      (move instanceof SimpleMove && move.piece instanceof Pawn)
    ) {
      return 0;
    }

    return this.halfMoveClock + 1;
  }

  afterMove(move: Move, controller: Controller, nextBoard: Board): GameResult {
    if (this.isCurrSideKingAttacked(controller, nextBoard)) {
      throw new KingExposedException();
    }

    const nextHalfMoveClock = this.getHalfMoveClockAfterMove(move);

    return new GameResult(nextHalfMoveClock, nextBoard);
  }

  get isOver() {
    return this.status !== GameStatus.ONGOING;
  }
}
