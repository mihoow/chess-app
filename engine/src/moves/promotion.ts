import { Square } from '../state';
import { AdvancesTo, Coord, PieceID } from '../types';
import { Bishop, Knight, Queen, Rook } from '../pieces';
import { Move } from './abstract';
import { BadInputException, InternalStateException, MissingPawnPromotionChoiceException } from '../utils';

export class PromotionMove extends Move {
  execute(boardMap: Map<Coord, Square>): Map<Coord, Square> {
    if (!this.options.advancesTo) {
      const pawnPiece = boardMap.get(this.from.coord)?.piece;
      if (!pawnPiece) throw new InternalStateException(`Pawn was not found at coord: ${this.from.coord}`);

      throw new MissingPawnPromotionChoiceException(pawnPiece);
    }

    boardMap.set(this.from.coord, new Square(this.from, null));
    boardMap.set(this.to.coord, new Square(this.to, this.getNewPiece(this.options.advancesTo)));

    return boardMap;
  }

  private getNewPiece(advancesTo: AdvancesTo) {
    const side = this.piece.side;

    switch (advancesTo) {
      case PieceID.Rook:
        return new Rook(side);
      case PieceID.Knight:
        return new Knight(side);
      case PieceID.Bishop:
        return new Bishop(side);
      case PieceID.Queen:
        return new Queen(side);
      default:
        throw new BadInputException(`Unknown piece ID: ${advancesTo}`);
    }
  }
}
