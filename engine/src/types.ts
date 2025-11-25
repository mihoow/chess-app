export type Color = 'white' | 'black';

export type Coord = `${string}${number}`;

export enum PieceID {
  Pawn = 'p',
  Rook = 'r',
  Knight = 'n',
  Bishop = 'b',
  Queen = 'q',
  King = 'k',
}

export type AdvancesTo = PieceID.Rook | PieceID.Bishop | PieceID.Knight | PieceID.Queen;

export type MovePayload = {
  from: Coord;
  to: Coord;
  advancesTo?: AdvancesTo;
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
