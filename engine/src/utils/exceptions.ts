export abstract class ChessException extends Error {
  abstract code: string;
  abstract description: string;
}

export class InternalStateException extends ChessException {
  code = 'INTERNAL_STATE';
  description = 'The game state became internally inconsistent. This indicates a bug in the engine.';

  constructor(message?: string) {
    super(message ?? 'Internal engine error: inconsistent state');
  }
}

export class IllegalMoveException extends ChessException {
  code = 'ILLEGAL_MOVE';
  description = 'The attempted move is not legal.';
}

export class KingExposedException extends IllegalMoveException {
  code = 'KING_EXPOSED';
  description = 'This move would leave the king in check, which is illegal.';

  constructor() {
    super('Move rejected: it would expose your king to attack.');
  }
}

export class GameOverException extends IllegalMoveException {
  code = 'GAME_OVER';
  description = 'The game has already ended, no further moves are allowed.';

  constructor() {
    super('Cannot make a move: the game is over.');
  }
}

export class BadInputException extends ChessException {
  code = 'BAD_INPUT';
  description = 'The provided input is invalid or incomplete.';
}
