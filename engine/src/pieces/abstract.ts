import { Move } from '../moves';
import { Position } from '../utils/position';
import { Color, Coord, PieceID } from '../types';
import { IController } from '../controller';

export abstract class Piece {
  abstract readonly id: PieceID;
  readonly side: Color;

  constructor(side: Color) {
    this.side = side;
  }

  abstract generatePossibleMoves(currPosition: Position, controller: IController): Map<Coord, Move>;
}
