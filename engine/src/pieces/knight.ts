import { CaptureMove, Move, SimpleMove } from '../moves';
import { Position } from '../utils/position';
import { Coord } from '../types';
import { Piece } from './abstract';
import { IController } from '../controller';

export class Knight extends Piece {
  readonly name = 'Knight';

  generatePossibleMoves(currPosition: Position, { board }: IController): Map<Coord, Move> {
    const possibleEndPositions = [
      currPosition.moveY(2)?.moveX(1),
      currPosition.moveX(2)?.moveY(1),
      currPosition.moveX(2)?.moveY(-1),
      currPosition.moveY(-2)?.moveX(1),
      currPosition.moveY(-2)?.moveX(-1),
      currPosition.moveX(-2)?.moveY(-1),
      currPosition.moveX(-2)?.moveY(1),
      currPosition.moveY(2)?.moveX(-1),
    ].filter(Position.isPosition);

    return possibleEndPositions.reduce((moves, endPosition) => {
      const square = board.getSquare(endPosition);
      if (!square) return moves;

      if (!square.piece) {
        moves.set(endPosition.coord, new SimpleMove(this, currPosition, endPosition));
      } else if (square.piece.side !== this.side) {
        moves.set(endPosition.coord, new CaptureMove(this, currPosition, endPosition));
      }

      return moves;
    }, new Map<Coord, Move>());
  }
}
