import { Square } from '../state';
import { Coord } from '../types';
import { Move } from './abstract';

export class CastlingMove extends Move {
  execute(boardMap: Map<Coord, Square>): Map<Coord, Square> {
    // TODO
    return boardMap;
  }
}
