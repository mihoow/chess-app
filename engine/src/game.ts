import { Color, GameStatus, MovePayload } from './types';
import { Controller } from './controller';

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

  getFEN(): string {
    return this.controller.getFEN();
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
}
