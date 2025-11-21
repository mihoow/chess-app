import { CaptureMove, EnPassantMove, Move, PromotionMove, SimpleMove } from '../moves';
import { Position } from '../utils/position';
import { Coord, Direction } from '../types';
import { Piece } from './abstract';
import { IController } from '../controller';

export class Pawn extends Piece {
  readonly name = 'Pawn';

  generatePossibleMoves(currPosition: Position, { board, enPassant }: IController): Map<Coord, Move> {
    const moves = new Map<Coord, Move>();

    // 1-square moves
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

    // 2-square moves
    const isInitialPosition =
      (this.side === 'white' && currPosition.rank === 2) || (this.side === 'black' && currPosition.rank === 7);
    if (isInitialPosition) {
      const intermediaryPosition = currPosition.moveY(this.side === 'white' ? 1 : -1);
      const movePosition = currPosition.moveY(this.side === 'white' ? 2 : -2);
      if (
        intermediaryPosition &&
        movePosition &&
        !board.getSquare(intermediaryPosition)?.piece &&
        !board.getSquare(movePosition)?.piece
      ) {
        moves.set(movePosition.coord, new SimpleMove(this, currPosition, movePosition));
      }
    }

    // captures
    const possibleCapturePositions = [];

    if (this.side === 'white') {
      possibleCapturePositions.push(
        currPosition.moveByDirection(Direction.UP_LEFT),
        currPosition.moveByDirection(Direction.UP_RIGHT)
      );
    } else {
      possibleCapturePositions.push(
        currPosition.moveByDirection(Direction.DOWN_LEFT),
        currPosition.moveByDirection(Direction.DOWN_RIGHT)
      );
    }

    possibleCapturePositions.filter(Position.isPosition).forEach((capturePosition) => {
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
