import { Position } from '../utils';
import { Square } from './square';
import { Coord } from '../types';
import { Move } from '../moves';

export class Board {
  private mapping: Map<Coord, Square>;

  static fromFEN(piecePlacement: string) {
    const mapping = new Map<Coord, Square>();

    const ranks = piecePlacement.split('/');
    ranks.forEach((rank, rankIndex) => {
      for (const c of rank) {
        let currFileNo = 1;
        const isNumber = !isNaN(parseInt(c));

        if (isNumber) {
          const lastFileNo = currFileNo + parseInt(c);
          while (currFileNo < lastFileNo) {
            const position = new Position(currFileNo, 8 - rankIndex);
            mapping.set(position.coord, Square.fromFEN(position));
            currFileNo++;
          }
        } else {
          const position = new Position(currFileNo, 8 - rankIndex);
          mapping.set(position.coord, Square.fromFEN(position, c));
          currFileNo++;
        }
      }
    });

    return new this(mapping);
  }

  constructor(mapping: Map<Coord, Square>) {
    this.mapping = mapping;
  }

  afterMove(move: Move): Board {
    const copy = new Map(this.mapping);
    return new Board(move.execute(copy));
  }

  getSquare(position: Position): Square | null {
    return this.mapping.get(position.coord) || null;
  }

  forEachSquare(callback: (position: Position, square: Square) => void) {
    this.mapping.forEach((square, coord) => {
      callback(Position.fromCoord(coord), square);
    });
  }

  toFEN(): string {
    const rows: string[] = [];

    // ranks 8 → 1
    for (let rank = 8; rank >= 1; rank--) {
      let row = '';
      let emptyCount = 0;

      // files a → h
      for (let file = 1; file <= 8; file++) {
        const position = new Position(file, rank);
        const square = this.mapping.get(position.coord);

        const piece = square?.getPieceLetter() ?? null;

        if (piece) {
          // flush accumulated empties
          if (emptyCount > 0) {
            row += emptyCount.toString();
            emptyCount = 0;
          }
          row += piece;
        } else {
          emptyCount++;
        }
      }

      // flush empties at the end of the rank
      if (emptyCount > 0) {
        row += emptyCount.toString();
      }

      rows.push(row);
    }

    return rows.join('/');
  }
}
