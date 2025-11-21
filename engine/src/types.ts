export type Color = 'white' | 'black';

export type Coord = `${string}${number}`;

export type MovePayload = {
  from: Coord;
  to: Coord;
  advancesTo?: 'r' | 'n' | 'b' | 'q';
};

export enum Direction {
  UP,
  UP_RIGHT,
  RIGHT,
  DOWN_RIGHT,
  DOWN,
  DOWN_LEFT,
  LEFT,
  UP_LEFT,
}

export enum GameStatus {
  ONGOING,
  CHECKMATE,
  DRAW,
  STALEMATE,
}
