import { describe, it, expect } from 'vitest';

describe('apply move', () => {
  it('moves white pawn from e2 to e4', () => {
    const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const expectedFen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';

    expect(startFen).toBe(expectedFen);
  });
});
