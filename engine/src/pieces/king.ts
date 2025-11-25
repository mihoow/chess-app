import { CaptureMove, Move, SimpleMove } from '../moves';
import { Position } from '../utils/position';
import { Coord, Direction, PieceID } from '../types';
import { Piece } from './abstract';
import { IController } from '../controller';

export class King extends Piece {
  readonly id = PieceID.King;

  private generateSimpleMoves(currPosition: Position, { board }: IController): Map<Coord, Move> {
    const possibleEndPositions = [
      currPosition.moveByDirection(Direction.UP),
      currPosition.moveByDirection(Direction.UP_RIGHT),
      currPosition.moveByDirection(Direction.RIGHT),
      currPosition.moveByDirection(Direction.DOWN_RIGHT),
      currPosition.moveByDirection(Direction.DOWN),
      currPosition.moveByDirection(Direction.DOWN_LEFT),
      currPosition.moveByDirection(Direction.LEFT),
      currPosition.moveByDirection(Direction.UP_LEFT),
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

  private generateCastlingMoves() {
    // TODO
    return new Map();
  }

  generatePossibleMoves(currPosition: Position, controller: IController): Map<Coord, Move> {
    return new Map([...this.generateSimpleMoves(currPosition, controller), ...this.generateCastlingMoves()]);
  }
}
