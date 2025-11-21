import { Coord, Direction } from '../types';
import { InternalStateException } from './exceptions';

export class Position {
  readonly file: string;
  readonly rank: number;

  constructor(fileNo: number, rankNo: number) {
    this.file = String.fromCharCode(96 + fileNo);
    this.rank = rankNo;
  }

  static fromCoord(coord: string) {
    const [file, rankString] = coord.split('');

    return new this(file.charCodeAt(0) - 96, parseInt(rankString));
  }

  static isPosition(pos: unknown): pos is Position {
    return pos instanceof Position;
  }

  get fileNo() {
    return this.file.charCodeAt(0) - 96;
  }

  get coord(): Coord {
    return (this.file + this.rank) as Coord;
  }

  private newPosition(fileNo: number, rankNo: number) {
    if (fileNo < 1 || fileNo > 8) return null;
    if (rankNo < 1 || rankNo > 8) return null;

    return new Position(fileNo, rankNo);
  }

  moveByDirection(direction: Direction): Position | null {
    switch (direction) {
      case Direction.UP:
        return this.newPosition(this.fileNo, this.rank + 1);
      case Direction.UP_RIGHT:
        return this.newPosition(this.fileNo + 1, this.rank + 1);
      case Direction.RIGHT:
        return this.newPosition(this.fileNo + 1, this.rank);
      case Direction.DOWN_RIGHT:
        return this.newPosition(this.fileNo + 1, this.rank - 1);
      case Direction.DOWN:
        return this.newPosition(this.fileNo, this.rank - 1);
      case Direction.DOWN_LEFT:
        return this.newPosition(this.fileNo - 1, this.rank - 1);
      case Direction.LEFT:
        return this.newPosition(this.fileNo - 1, this.rank);
      case Direction.UP_LEFT:
        return this.newPosition(this.fileNo - 1, this.rank + 1);
      default:
        throw new InternalStateException(`Unknown direction: ${direction}`);
    }
  }

  moveY(y: number) {
    return this.newPosition(this.fileNo, this.rank + y);
  }

  moveX(x: number) {
    return this.newPosition(this.fileNo + x, this.rank);
  }

  distanceTo(nextPosition: Position): { x: number; y: number } {
    return {
      x: Math.abs(this.fileNo - nextPosition.fileNo),
      y: Math.abs(this.rank - nextPosition.rank),
    };
  }
}
