import { Square } from '../controllers';
import { Coord } from '../types';
import { Move } from './abstract';

export class SimpleMove extends Move {
  execute(boardMap: Map<Coord, Square>): Map<Coord, Square> {
    boardMap.set(this.from.coord, new Square(this.from, null));
    boardMap.set(this.to.coord, new Square(this.to, this.piece));

    return boardMap;
  }
}
