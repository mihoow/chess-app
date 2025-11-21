import { Position } from '../utils/position';
import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from '../pieces';
import { Color } from '../types';
import { BadInputException, InternalStateException } from '../utils';

export class Square {
  readonly position: Position;
  readonly color: Color;
  readonly piece: Piece | null;

  private static getPieceFromLetter(pieceLetter: string): Piece {
    const isWhite = pieceLetter === pieceLetter.toUpperCase();
    const side: Color = isWhite ? 'white' : 'black';

    switch (pieceLetter.toLowerCase()) {
      case 'p':
        return new Pawn(side);
      case 'r':
        return new Rook(side);
      case 'n':
        return new Knight(side);
      case 'b':
        return new Bishop(side);
      case 'q':
        return new Queen(side);
      case 'k':
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
      if (this.piece instanceof Pawn) return 'p';
      if (this.piece instanceof Rook) return 'r';
      if (this.piece instanceof Knight) return 'n';
      if (this.piece instanceof Bishop) return 'b';
      if (this.piece instanceof Queen) return 'q';
      if (this.piece instanceof King) return 'k';

      throw new InternalStateException(`Unknown piece: ${this.piece}`);
    })();

    return this.piece.side === 'white' ? letter.toUpperCase() : letter;
  }
}
