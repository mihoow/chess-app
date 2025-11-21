import { CaptureMove, Move } from '../moves';
import { King, Rook } from '../pieces';
import { Board } from './board';
import { Controller } from './controller';

interface ICastlingRights {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
}

export class CastlingRights implements ICastlingRights {
  readonly whiteKingSide: boolean;
  readonly whiteQueenSide: boolean;
  readonly blackKingSide: boolean;
  readonly blackQueenSide: boolean;

  static fromFEN(rights: string) {
    return new this({
      whiteKingSide: rights.includes('K'),
      whiteQueenSide: rights.includes('Q'),
      blackKingSide: rights.includes('k'),
      blackQueenSide: rights.includes('q'),
    });
  }

  constructor({ whiteKingSide, whiteQueenSide, blackKingSide, blackQueenSide }: ICastlingRights) {
    this.whiteKingSide = whiteKingSide;
    this.whiteQueenSide = whiteQueenSide;
    this.blackKingSide = blackKingSide;
    this.blackQueenSide = blackQueenSide;
  }

  afterMove(move: Move, { ply, board: prevBoard }: Controller, nextBoard: Board): CastlingRights {
    const rights: ICastlingRights = {
      whiteQueenSide: this.whiteQueenSide,
      whiteKingSide: this.whiteKingSide,
      blackQueenSide: this.blackQueenSide,
      blackKingSide: this.blackKingSide,
    };

    // if rook has moved
    if (move.piece instanceof Rook) {
      if (move.from.coord === 'a1') {
        rights.whiteQueenSide = false;
      } else if (move.from.coord === 'h1') {
        rights.whiteKingSide = false;
      } else if (move.from.coord === 'a8') {
        rights.blackQueenSide = false;
      } else if (move.from.coord === 'h8') {
        rights.blackKingSide = false;
      }
    }

    // if king has moved
    if (move.piece instanceof King) {
      if (ply.sideToMove === 'white') {
        rights.whiteKingSide = false;
        rights.whiteQueenSide = false;
      } else {
        rights.blackKingSide = false;
        rights.blackQueenSide = false;
      }
    }

    // if rook was captured
    if (move instanceof CaptureMove && prevBoard.getSquare(move.to)?.piece instanceof Rook) {
      const rookCoord = move.to.coord;

      if (rights.whiteQueenSide && rookCoord === 'a1') {
        rights.whiteQueenSide = false;
      } else if (rights.whiteKingSide && rookCoord === 'h1') {
        rights.whiteKingSide = false;
      } else if (rights.blackQueenSide && rookCoord === 'a8') {
        rights.blackQueenSide = false;
      } else if (rights.blackKingSide && rookCoord === 'h8') {
        rights.blackKingSide = false;
      }
    }

    return new CastlingRights(rights);
  }

  toFEN(): string {
    let out = '';
    if (this.whiteKingSide) out += 'K';
    if (this.whiteQueenSide) out += 'Q';
    if (this.blackKingSide) out += 'k';
    if (this.blackQueenSide) out += 'q';
    return out || '-';
  }
}
