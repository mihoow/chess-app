import { Square } from '../controllers';
import { Coord } from '../types';
import { Piece } from '../pieces';
import { Position } from '../utils/position';

export abstract class Move {
  readonly piece: Piece;
  readonly from: Position;
  readonly to: Position;

  constructor(piece: Piece, from: Position, to: Position) {
    this.piece = piece;
    this.from = from;
    this.to = to;
  }

  abstract execute(boardMap: Map<Coord, Square>, options?: { advancesTo?: 'r' | 'n' | 'b' | 'q' }): Map<Coord, Square>;
}
