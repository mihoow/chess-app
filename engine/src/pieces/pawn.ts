import { CaptureMove, EnPassantMove, Move, PromotionMove, SimpleMove } from '../moves';
import { Position } from '../utils/position';
import { Coord, Direction } from '../types';
import { Piece } from './abstract';
import { Controller } from '../controllers';

export class Pawn extends Piece {
  readonly name = 'Pawn';

  generatePossibleMoves(currPosition: Position, { board, enPassant }: Controller): Map<Coord, Move> {
    const moves = new Map<Coord, Move>();

    const movePosition = currPosition.moveByDirection(this.side === 'white' ? Direction.UP : Direction.DOWN);
    if (movePosition) {
      const square = board.getSquare(movePosition);
      if (square && !square.piece) {
        if (movePosition.rank === 1 || movePosition.rank === 8) {
          moves.set(movePosition.coord, new PromotionMove(this, currPosition, movePosition));
        } else {
          moves.set(movePosition.coord, new SimpleMove(this, currPosition, movePosition));
        }
      }
    }

    const isInitialPosition =
      (this.side === 'white' && currPosition.rank === 2) || (this.side === 'black' && currPosition.rank === 7);
    if (isInitialPosition) {
      const movePosition = currPosition.moveY(this.side === 'white' ? 2 : -2);
      if (movePosition) {
        const square = board.getSquare(movePosition);
        if (square && !square.piece) {
          moves.set(movePosition.coord, new SimpleMove(this, currPosition, movePosition));
        }
      }
    }

    const possibleCapturePositions = [
      currPosition.moveByDirection(Direction.UP_LEFT),
      currPosition.moveByDirection(Direction.UP_RIGHT),
    ].filter(Position.isPosition);

    possibleCapturePositions.forEach((capturePosition) => {
      const square = board.getSquare(capturePosition);
      if (square?.piece && square.piece.side !== this.side) {
        moves.set(capturePosition.coord, new CaptureMove(this, currPosition, capturePosition));
      } else if (!square?.piece && capturePosition.coord === enPassant.targetPosition?.coord) {
        moves.set(capturePosition.coord, new EnPassantMove(this, currPosition, capturePosition));
      }
    });

    return moves;
  }
}
