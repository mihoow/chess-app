import { describe, it, expect } from 'vitest';
import { Game } from '../src';

describe('Scenarios', () => {
  it('scenario: simple opening sequence', () => {
    const game = new Game('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    game
      .makeMove({ from: 'e2', to: 'e4' }) // white
      .makeMove({ from: 'e7', to: 'e5' }) // black
      .makeMove({ from: 'g1', to: 'f3' }) // white
      .makeMove({ from: 'b8', to: 'c6' }); // black

    expect(game.getFEN()).toBe('r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3');
  });

  it('scenario: bishop + queen development', () => {
    const game = new Game('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    game
      .makeMove({ from: 'd2', to: 'd4' }) // white
      .makeMove({ from: 'd7', to: 'd5' }) // black
      .makeMove({ from: 'c1', to: 'g5' }) // white
      .makeMove({ from: 'd8', to: 'd6' }); // black

    expect(game.getFEN()).toBe('rnb1kbnr/ppp1pppp/3q4/3p2B1/3P4/8/PPP1PPPP/RN1QKBNR w KQkq - 2 3');
  });
});
