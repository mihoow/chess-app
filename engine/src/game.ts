import { Color, GameStatus, MovePayload } from './types';
import { Controller } from './controller';
import { Position } from './utils';
import { Square } from './state';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export class Game {
  private controller: Controller;

  constructor(fen = INITIAL_FEN) {
    this.controller = Controller.fromFEN(fen);
  }

  makeMove(payload: MovePayload) {
    this.controller = this.controller.makeMove(payload);

    return this;
  }

  get isOver(): boolean {
    return this.controller.gameResult.isOver;
  }

  get status(): GameStatus {
    return this.controller.gameResult.status;
  }

  get winner(): Color | null {
    return this.controller.gameResult.winner;
  }

  get sideToMove(): Color {
    return this.controller.ply.sideToMove;
  }

  getBoard(): Array<[Position, Square]> {
    const result: Array<[Position, Square]> = [];

    this.controller.board.forEachSquare((position, square) => {
      result.push([position, square]);
    });

    return result;
  }

  getFEN(): string {
    return this.controller.getFEN();
  }
}
