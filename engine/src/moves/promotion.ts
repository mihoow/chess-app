import { Square } from '../state';
import { Coord } from '../types';
import { Bishop, Knight, Queen, Rook } from '../pieces';
import { Move } from './abstract';
import { BadInputException } from '../utils';

export class PromotionMove extends Move {
  execute(boardMap: Map<Coord, Square>): Map<Coord, Square> {
    if (!this.options.advancesTo) {
      throw new BadInputException(
        'Promotion move has to receive `advancesTo` option specifying to which piece the pawn will be promoted'
      );
    }

    boardMap.set(this.from.coord, new Square(this.from, null));
    boardMap.set(this.to.coord, new Square(this.to, this.getNewPiece(this.options.advancesTo)));

    return boardMap;
  }

  private getNewPiece(advancesTo: 'r' | 'n' | 'b' | 'q') {
    const side = this.piece.side;

    switch (advancesTo) {
      case 'r':
        return new Rook(side);
      case 'n':
        return new Knight(side);
      case 'b':
        return new Bishop(side);
      case 'q':
        return new Queen(side);
      default:
        throw new BadInputException(`Unknown letter for piece: ${advancesTo}`);
    }
  }
}
