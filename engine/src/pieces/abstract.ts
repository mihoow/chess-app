import { Move } from '../moves';
import { Position } from '../utils/position';
import { Color, Coord } from '../types';
import { Controller } from '../controllers';

export abstract class Piece {
  abstract readonly name: string;
  readonly side: Color;

  constructor(side: Color) {
    this.side = side;
  }

  abstract generatePossibleMoves(currPosition: Position, controller: Controller): Map<Coord, Move>;
}
