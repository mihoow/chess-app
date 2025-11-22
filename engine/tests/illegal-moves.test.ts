import { describe, it, expect } from 'vitest';
import { Game } from '../src';

describe('Illegal Moves', () => {
  it('rejects move from a non-existent square', () => {
    const game = new Game('4k3/8/8/8/8/8/8/4K3 w - - 0 1');

    expect(() => game.makeMove({ from: 'z9', to: 'a1' })).toThrow();
  });

  it('rejects move to a non-existent square', () => {
    const game = new Game('4k3/8/8/8/8/8/8/4K3 w - - 0 1');

    expect(() => game.makeMove({ from: 'e1', to: 'k4' })).toThrow();
  });

  it('rejects moving from an empty square', () => {
    const game = new Game('4k3/8/8/8/8/8/8/4K3 w - - 0 1');

    expect(() => game.makeMove({ from: 'a1', to: 'a2' })).toThrow();
  });

  it('rejects illegal move for a piece (rook moving like a knight)', () => {
    const game = new Game('4k3/8/8/8/8/8/8/R3K3 w - - 0 1');

    expect(() => game.makeMove({ from: 'a1', to: 'b3' })).toThrow();
  });

  it('rejects illegal move for a piece (bishop moving straight)', () => {
    const game = new Game('4k3/8/8/8/8/8/8/2B1K3 w - - 0 1');

    expect(() => game.makeMove({ from: 'c1', to: 'c4' })).toThrow();
  });

  it('rejects capture of own piece', () => {
    const game = new Game('4k3/8/8/8/8/8/4P3/4K3 w - - 0 1');

    expect(() => game.makeMove({ from: 'e1', to: 'e2' })).toThrow();
  });

  it('rejects bishop jumping over a pawn', () => {
    const game = new Game('4k3/8/8/8/5P2/8/8/2B1K3 w - - 0 1');

    expect(() => game.makeMove({ from: 'c1', to: 'h6' })).toThrow();
  });

  it('rejects rook jumping over a pawn', () => {
    const game = new Game('4k3/8/8/8/4P3/8/8/4KR2 w - - 0 1');

    expect(() => game.makeMove({ from: 'e1', to: 'e5' })).toThrow();
  });

  it('rejects knight move when not its turn', () => {
    const game = new Game('4k3/8/8/8/8/8/8/4KN2 b - - 0 1');

    expect(() => game.makeMove({ from: 'g1', to: 'f3' })).toThrow();
  });

  it('ignores promotion choice if pawn is not on last rank', () => {
    const game = new Game('4k3/8/8/8/8/8/4P3/4K3 w - - 0 1');

    game.makeMove({ from: 'e2', to: 'e3', advancesTo: 'q' });

    expect(game.getFEN()).toBe('4k3/8/8/8/8/4P3/8/4K3 b - - 0 1');
  });

  it('rejects en passant when no en passant target exists', () => {
    const game = new Game('4k3/8/8/8/4pP2/8/8/4K3 w - - 0 1');

    expect(() => game.makeMove({ from: 'f5', to: 'e6' })).toThrow();
  });

  it('rejects move that exposes own king', () => {
    const game = new Game('r3k2r/8/8/8/8/8/8/r2QK2r w KQkq - 0 1');

    expect(() => game.makeMove({ from: 'd1', to: 'd3' })).toThrow();
  });
});
