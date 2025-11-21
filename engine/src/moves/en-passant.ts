import { Square } from '../state';
import { Coord } from '../types';
import { InternalStateException } from '../utils';
import { Move } from './abstract';
import { SimpleMove } from './simple';

export class EnPassantMove extends SimpleMove {
  execute(boardMap: Map<Coord, Square>): Map<Coord, Square> {
    const enemyPosition = this.piece.side === 'white' ? this.to.moveY(-1) : this.to.moveY(1);
    if (!enemyPosition) throw new InternalStateException(`Enemy position does not exists`);
    boardMap.set(enemyPosition.coord, new Square(enemyPosition, null));

    return super.execute(boardMap);
  }
}
