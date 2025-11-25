import { CaptureMove, Move, SimpleMove } from '../moves';
import { Position } from '../utils/position';
import { Coord, Direction, PieceID } from '../types';
import { Piece } from './abstract';
import { IController } from '../controller';

export class Bishop extends Piece {
  readonly id = PieceID.Bishop;

  generatePossibleMoves(currPosition: Position, { board }: IController): Map<Coord, Move> {
    const directions = [Direction.UP_RIGHT, Direction.DOWN_RIGHT, Direction.DOWN_LEFT, Direction.UP_LEFT];

    const moves = new Map<Coord, Move>();

    directions.forEach((direction) => {
      let position = currPosition.moveByDirection(direction);
      while (position) {
        const square = board.getSquare(position);
        if (!square) break;

        if (!square.piece) {
          moves.set(position.coord, new SimpleMove(this, currPosition, position));
        } else if (square.piece.side !== this.side) {
          moves.set(position.coord, new CaptureMove(this, currPosition, position));
          break;
        } else {
          break;
        }

        position = position.moveByDirection(direction);
      }
    });

    return moves;
  }
}
