import { MovePayload } from './types';
import { Controller } from './controllers';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export class Game {
  private controller: Controller;

  constructor(fen = INITIAL_FEN) {
    this.controller = Controller.fromFEN(fen);
  }

  makeMove(payload: MovePayload) {
    this.controller = this.controller.makeMove(payload);
  }

  getFEN(): string {
    return this.controller.getFEN();
  }
}
