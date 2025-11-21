import { Color } from '../types';

export class Ply {
  readonly sideToMove: Color;
  readonly plyNo: number;

  static fromFEN(sideLetter: string, fullMove: string) {
    return new this(sideLetter === 'w' ? 'white' : 'black', parseInt(fullMove));
  }

  constructor(sideToMove: Color, fullMoveNo: number) {
    this.sideToMove = sideToMove;
    this.plyNo = fullMoveNo * 2 - (sideToMove === 'white' ? 1 : 0);
  }

  afterMove() {
    return new Ply(this.sideToMove === 'white' ? 'black' : 'white', this.plyNo + 1);
  }

  get fullMove() {
    return Math.ceil(this.plyNo / 2);
  }
}
