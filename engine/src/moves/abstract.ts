import { Square } from '../state';
import { Coord } from '../types';
import { Piece } from '../pieces';
import { Position } from '../utils/position';

type Options = { advancesTo?: 'r' | 'n' | 'b' | 'q' };

export abstract class Move {
  readonly piece: Piece;
  readonly from: Position;
  readonly to: Position;

  protected options: { advancesTo?: 'r' | 'n' | 'b' | 'q' } = {};

  constructor(piece: Piece, from: Position, to: Position) {
    this.piece = piece;
    this.from = from;
    this.to = to;
  }

  abstract execute(boardMap: Map<Coord, Square>): Map<Coord, Square>;

  setOptions(options: Options) {
    this.options = options;
  }
}
