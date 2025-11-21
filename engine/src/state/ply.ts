import { Color } from '../types';

export class Ply {
  readonly sideToMove: Color;
  readonly plyNo: number;

  static fromFEN(sideLetter: string, fullMove: string) {
    const side: Color = sideLetter === 'w' ? 'white' : 'black';
    const fullMoveNo = parseInt(fullMove);
    const plyNo = fullMoveNo * 2 - (side === 'white' ? 1 : 0);

    return new this(side, plyNo);
  }

  constructor(sideToMove: Color, plyNo: number) {
    this.sideToMove = sideToMove;
    this.plyNo = plyNo;
  }

  afterMove() {
    return new Ply(this.sideToMove === 'white' ? 'black' : 'white', this.plyNo + 1);
  }

  get fullMove() {
    return Math.ceil(this.plyNo / 2);
  }
}
