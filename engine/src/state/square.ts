import { Position } from '../utils/position';
import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from '../pieces';
import { Color, PieceID } from '../types';
import { BadInputException, InternalStateException } from '../utils';

export class Square {
  readonly position: Position;
  readonly color: Color;
  readonly piece: Piece | null;

  private static getPieceFromLetter(pieceLetter: string): Piece {
    const isWhite = pieceLetter === pieceLetter.toUpperCase();
    const side: Color = isWhite ? 'white' : 'black';

    switch (pieceLetter.toLowerCase()) {
      case PieceID.Pawn:
        return new Pawn(side);
      case PieceID.Rook:
        return new Rook(side);
      case PieceID.Knight:
        return new Knight(side);
      case PieceID.Bishop:
        return new Bishop(side);
      case PieceID.Queen:
        return new Queen(side);
      case PieceID.King:
        return new King(side);
      default:
        throw new BadInputException(`Unknown piece letter: ${pieceLetter}`);
    }
  }

  static fromFEN(position: Position, pieceLetter?: string) {
    const piece = pieceLetter ? this.getPieceFromLetter(pieceLetter) : null;

    return new this(position, piece);
  }

  constructor(position: Position, piece: Piece | null) {
    this.position = position;
    this.color = this.calculateSquareColor(position);
    this.piece = piece;
  }

  private calculateSquareColor(coord: Position): Color {
    return (coord.fileNo + coord.rank) % 2 === 0 ? 'black' : 'white';
  }

  getPieceLetter(): string | null {
    if (!this.piece) return null;

    const letter = (() => {
      if (this.piece instanceof Pawn) return PieceID.Pawn;
      if (this.piece instanceof Rook) return PieceID.Rook;
      if (this.piece instanceof Knight) return PieceID.Knight;
      if (this.piece instanceof Bishop) return PieceID.Bishop;
      if (this.piece instanceof Queen) return PieceID.Queen;
      if (this.piece instanceof King) return PieceID.King;

      throw new InternalStateException(`Unknown piece: ${this.piece}`);
    })();

    return this.piece.side === 'white' ? letter.toUpperCase() : letter;
  }
}
