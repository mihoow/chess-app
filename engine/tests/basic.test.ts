import { describe, it, expect } from 'vitest';
import { Game, GameStatus } from '../src';

describe('FEN Validity', () => {
  it('FEN passed is exactly the same as FEN retrieved', () => {
    const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const game = new Game(FEN);
    expect(game.getFEN()).toBe(FEN);
  });
});

describe('Checkmate detection', () => {
  it('identifies checkmate delivered by white', () => {
    const game = new Game('r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1KBNR b KQkq - 0 4');

    expect(game.isOver).toBe(true);
    expect(game.winner).toBe('white');
    expect(game.status).toBe(GameStatus.CHECKMATE);
  });

  it('identifies checkmate delivered by black', () => {
    const game = new Game('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3');

    expect(game.isOver).toBe(true);
    expect(game.winner).toBe('black');
    expect(game.status).toBe(GameStatus.CHECKMATE);
  });
});
