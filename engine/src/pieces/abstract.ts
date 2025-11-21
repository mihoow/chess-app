import { Move } from '../moves';
import { Position } from '../utils/position';
import { Color, Coord } from '../types';
import { IController } from '../controller';

export abstract class Piece {
  abstract readonly name: string;
  readonly side: Color;

  constructor(side: Color) {
    this.side = side;
  }

  abstract generatePossibleMoves(currPosition: Position, controller: IController): Map<Coord, Move>;
}
