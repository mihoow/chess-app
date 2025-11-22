import { describe, it, expect } from 'vitest';
import { Game, MovePayload } from '../src';

const runMoveTest = ({
  it: itText,
  fenBefore,
  expected,
  ...move
}: { it: string; fenBefore: string; expected: string } & MovePayload) => {
  it(itText, () => {
    const game = new Game(fenBefore);
    game.makeMove(move);
    expect(game.getFEN()).toBe(expected);
  });
};

describe('Pawns', () => {
  runMoveTest({
    it: 'white single-step e2 -> e3',
    fenBefore: '8/8/8/8/8/8/4P3/4K2k w - - 0 1',
    from: 'e2',
    to: 'e3',
    expected: '8/8/8/8/8/4P3/8/4K2k b - - 0 1',
  });

  runMoveTest({
    it: 'black single-step e7 -> e6',
    fenBefore: '4k2r/4p3/8/8/8/8/8/4K3 b - - 0 1',
    from: 'e7',
    to: 'e6',
    expected: '4k2r/8/4p3/8/8/8/8/4K3 w - - 0 2',
  });

  runMoveTest({
    it: 'white double-step e2 -> e4',
    fenBefore: '8/8/8/8/8/8/4P3/4K2k w - - 0 1',
    from: 'e2',
    to: 'e4',
    expected: '8/8/8/8/4P3/8/8/4K2k b - e3 0 1',
  });

  runMoveTest({
    it: 'black double-step e7 -> e5',
    fenBefore: '4k2r/4p3/8/8/8/8/8/4K3 b - - 0 1',
    from: 'e7',
    to: 'e5',
    expected: '4k2r/8/8/4p3/8/8/8/4K3 w - e6 0 2',
  });

  runMoveTest({
    it: 'white capture left e4 -> d5',
    fenBefore: '8/8/8/3p4/4P3/8/8/4K2k w - - 0 1',
    from: 'e4',
    to: 'd5',
    expected: '8/8/8/3P4/8/8/8/4K2k b - - 0 1',
  });

  runMoveTest({
    it: 'white capture right e4 -> f5',
    fenBefore: '8/8/8/5p2/4P3/8/8/4K2k w - - 0 1',
    from: 'e4',
    to: 'f5',
    expected: '8/8/8/5P2/8/8/8/4K2k b - - 0 1',
  });

  runMoveTest({
    it: 'black capture left d5 -> c4',
    fenBefore: '4k2r/8/8/3p4/2P5/8/8/4K3 b - - 0 1',
    from: 'd5',
    to: 'c4',
    expected: '4k2r/8/8/8/2p5/8/8/4K3 w - - 0 2',
  });

  runMoveTest({
    it: 'black capture right d5 -> e4',
    fenBefore: '4k2r/8/8/3p4/4P3/8/8/4K3 b - - 0 1',
    from: 'd5',
    to: 'e4',
    expected: '4k2r/8/8/8/4p3/8/8/4K3 w - - 0 2',
  });

  runMoveTest({
    it: 'white en passant e5 x d6',
    fenBefore: '8/8/8/3pP3/8/8/8/4K2k w - d6 0 10',
    from: 'e5',
    to: 'd6',
    expected: '8/8/3P4/8/8/8/8/4K2k b - - 0 10',
  });

  runMoveTest({
    it: 'black en passant e4 x f3',
    fenBefore: '4k2r/8/8/8/4pP2/8/8/4K3 b - f3 0 10',
    from: 'e4',
    to: 'f3',
    expected: '4k2r/8/8/8/8/5p2/8/4K3 w - - 0 11',
  });

  runMoveTest({
    it: 'white promotion a7 -> a8 = Q',
    fenBefore: '8/P7/8/8/8/8/8/4K2k w - - 0 1',
    from: 'a7',
    to: 'a8',
    advancesTo: 'q',
    expected: 'Q7/8/8/8/8/8/8/4K2k b - - 0 1',
  });

  runMoveTest({
    it: 'black promotion h2 -> h1 = Q',
    fenBefore: '4k3/8/8/8/8/8/7p/4K3 b - - 0 1',
    from: 'h2',
    to: 'h1',
    advancesTo: 'q',
    expected: '4k3/8/8/8/8/8/8/4K2q w - - 0 2',
  });
});

describe('Rooks', () => {
  runMoveTest({
    it: 'white vertical move a1 -> a4 (no castling rights)',
    fenBefore: '4k3/8/8/8/8/8/8/R3K3 w - - 0 1',
    from: 'a1',
    to: 'a4',
    expected: '4k3/8/8/8/R7/8/8/4K3 b - - 1 1',
  });

  runMoveTest({
    it: 'black vertical move h8 -> h5 (no castling rights)',
    fenBefore: '4k2r/8/8/8/8/8/8/4K3 b - - 0 1',
    from: 'h8',
    to: 'h5',
    expected: '4k3/8/8/7r/8/8/8/4K3 w - - 1 2',
  });

  runMoveTest({
    it: 'white rook a1 moves, queenside castling right removed',
    fenBefore: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
    from: 'a1',
    to: 'a4',
    expected: 'r3k2r/8/8/8/R7/8/8/4K2R b Kkq - 1 1',
  });

  runMoveTest({
    it: 'white rook h1 moves, kingside castling right removed',
    fenBefore: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
    from: 'h1',
    to: 'h3',
    expected: 'r3k2r/8/8/8/8/7R/8/R3K3 b Qkq - 1 1',
  });

  runMoveTest({
    it: 'black rook a8 moves, black queenside castling right removed',
    fenBefore: 'r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1',
    from: 'a8',
    to: 'a5',
    expected: '4k2r/8/8/r7/8/8/8/R3K2R w KQk - 1 2',
  });

  runMoveTest({
    it: 'black rook h8 moves, black kingside castling right removed',
    fenBefore: 'r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1',
    from: 'h8',
    to: 'h6',
    expected: 'r3k3/8/7r/8/8/8/8/R3K2R w KQq - 1 2',
  });

  runMoveTest({
    it: 'white rook a1 captures from a1, queenside castling right removed',
    fenBefore: 'r3k2r/8/8/8/p7/8/8/R3K2R w KQkq - 0 1',
    from: 'a1',
    to: 'a4',
    expected: 'r3k2r/8/8/8/R7/8/8/4K2R b Kkq - 0 1',
  });

  runMoveTest({
    it: 'black rook h8 captures from h8, black kingside castling right removed',
    fenBefore: 'r3k2r/8/7P/8/8/8/8/R3K2R b KQkq - 0 1',
    from: 'h8',
    to: 'h6',
    expected: 'r3k3/8/7r/8/8/8/8/R3K2R w KQq - 0 2',
  });
});

describe('Knights', () => {
  runMoveTest({
    it: 'white g1 -> f3 (simple jump)',
    fenBefore: '4k3/8/8/8/8/8/8/4K1N1 w - - 0 1',
    from: 'g1',
    to: 'f3',
    expected: '4k3/8/8/8/8/5N2/8/4K3 b - - 1 1',
  });

  runMoveTest({
    it: 'white b1 -> c3 (jumps over own pawns)',
    fenBefore: '4k3/8/8/8/8/8/1PP4/1N2K3 w - - 0 1',
    from: 'b1',
    to: 'c3',
    expected: '4k3/8/8/8/8/2N5/1PP5/4K3 b - - 1 1',
  });

  runMoveTest({
    it: 'white captures from b3 -> c5',
    fenBefore: '4k3/8/8/2p5/8/1N6/8/4K3 w - - 0 1',
    from: 'b3',
    to: 'c5',
    expected: '4k3/8/8/2N5/8/8/8/4K3 b - - 0 1',
  });

  runMoveTest({
    it: 'white from corner a1 -> b3',
    fenBefore: '4k3/8/8/8/8/8/8/N3K3 w - - 0 1',
    from: 'a1',
    to: 'b3',
    expected: '4k3/8/8/8/8/1N6/8/4K3 b - - 1 1',
  });

  runMoveTest({
    it: 'black g8 -> e7 (simple jump)',
    fenBefore: '4k1n1/8/8/8/8/8/8/4K3 b - - 0 1',
    from: 'g8',
    to: 'e7',
    expected: '4k3/4n3/8/8/8/8/8/4K3 w - - 1 2',
  });

  runMoveTest({
    it: 'black captures from g6 -> e5',
    fenBefore: '4k3/8/6n1/4P3/8/8/8/4K3 b - - 0 1',
    from: 'g6',
    to: 'e5',
    expected: '4k3/8/8/4n3/8/8/8/4K3 w - - 0 2',
  });

  runMoveTest({
    it: 'black from corner a8 -> b6',
    fenBefore: 'n6k/8/8/8/8/8/8/N3K3 b - - 0 1',
    from: 'a8',
    to: 'b6',
    expected: '7k/8/1n6/8/8/8/8/N3K3 w - - 1 2',
  });

  runMoveTest({
    it: 'white knight moves, castling rights unchanged',
    fenBefore: 'r3k2r/8/8/8/8/8/8/R3K1NR w KQkq - 0 1',
    from: 'g1',
    to: 'f3',
    expected: 'r3k2r/8/8/8/8/5N2/8/R3K2R b KQkq - 1 1',
  });
});

describe('Bishops', () => {
  runMoveTest({
    it: 'white bishop c1 -> g5',
    fenBefore: '4k3/8/8/8/8/8/8/2B1K3 w - - 0 1',
    from: 'c1',
    to: 'g5',
    expected: '4k3/8/8/6B1/8/8/8/4K3 b - - 1 1',
  });

  runMoveTest({
    it: 'white bishop f1 -> a6',
    fenBefore: '4k3/8/8/8/8/8/8/4KB2 w - - 0 1',
    from: 'f1',
    to: 'a6',
    expected: '4k3/8/B7/8/8/8/8/4K3 b - - 1 1',
  });

  runMoveTest({
    it: 'black bishop c8 captures bishop on g4',
    fenBefore: '2b1k3/8/8/8/6B1/8/8/4K3 b - - 0 1',
    from: 'c8',
    to: 'g4',
    expected: '4k3/8/8/8/6b1/8/8/4K3 w - - 0 2',
  });

  runMoveTest({
    it: 'black bishop f8 captures bishop on b4',
    fenBefore: '4kb2/8/8/8/1B6/8/8/4K3 b - - 0 1',
    from: 'f8',
    to: 'b4',
    expected: '4k3/8/8/8/1b6/8/8/4K3 w - - 0 2',
  });

  runMoveTest({
    it: 'white bishop e4 captures pawn on d5',
    fenBefore: '4k3/8/8/3p4/4B3/8/8/4K3 w - - 0 1',
    from: 'e4',
    to: 'd5',
    expected: '4k3/8/8/3B4/8/8/8/4K3 b - - 0 1',
  });

  runMoveTest({
    it: 'black bishop g1 captures pawn on e3',
    fenBefore: '4k3/8/8/8/8/4P3/8/4K1b1 b - - 0 1',
    from: 'g1',
    to: 'e3',
    expected: '4k3/8/8/8/8/4b3/8/4K3 w - - 0 2',
  });

  runMoveTest({
    it: 'long diagonal move a1 -> h8',
    fenBefore: '4k3/8/8/8/8/8/8/B3K3 w - - 0 1',
    from: 'a1',
    to: 'h8',
    expected: '4k2B/8/8/8/8/8/8/4K3 b - - 1 1',
  });

  runMoveTest({
    it: 'bishop moves, castling rights unchanged',
    fenBefore: 'r3k2r/8/8/8/8/8/8/2B1K2R w KQkq - 0 1',
    from: 'c1',
    to: 'g5',
    expected: 'r3k2r/8/8/6B1/8/8/8/4K2R b KQkq - 1 1',
  });
});

describe('Queens', () => {
  runMoveTest({
    it: 'white queen c1 -> g5 (diagonal up-right)',
    fenBefore: '4k3/8/8/8/8/8/8/2Q1K3 w - - 0 1',
    from: 'c1',
    to: 'g5',
    expected: '4k3/8/8/6Q1/8/8/8/4K3 b - - 1 1',
  });

  runMoveTest({
    it: 'white queen d1 -> d4 (vertical up)',
    fenBefore: '4k3/8/8/8/8/8/8/3QK3 w - - 0 1',
    from: 'd1',
    to: 'd4',
    expected: '4k3/8/8/8/3Q4/8/8/4K3 b - - 1 1',
  });

  runMoveTest({
    it: 'white queen d1 -> a4 (diagonal up-left)',
    fenBefore: '4k3/8/8/8/8/8/8/3QK3 w - - 0 1',
    from: 'd1',
    to: 'a4',
    expected: '4k3/8/8/8/Q7/8/8/4K3 b - - 1 1',
  });

  runMoveTest({
    it: 'black queen d8 -> h4 (diagonal down-right)',
    fenBefore: '3qk3/8/8/8/8/8/8/4K3 b - - 0 1',
    from: 'd8',
    to: 'h4',
    expected: '4k3/8/8/8/7q/8/8/4K3 w - - 1 2',
  });

  runMoveTest({
    it: 'black queen d8 -> d5 (vertical down)',
    fenBefore: '3qk3/8/8/8/8/8/8/4K3 b - - 0 1',
    from: 'd8',
    to: 'd5',
    expected: '4k3/8/8/3q4/8/8/8/4K3 w - - 1 2',
  });

  runMoveTest({
    it: 'white queen a2 captures pawn on d5',
    fenBefore: '4k3/8/8/3p4/8/8/Q7/4K3 w - - 0 1',
    from: 'a2',
    to: 'd5',
    expected: '4k3/8/8/3Q4/8/8/8/4K3 b - - 0 1',
  });

  runMoveTest({
    it: 'black queen h4 captures bishop on e4',
    fenBefore: '4k3/8/8/8/4B2q/8/8/4K3 b - - 0 1',
    from: 'h4',
    to: 'e4',
    expected: '4k3/8/8/8/4q3/8/8/4K3 w - - 0 2',
  });

  runMoveTest({
    it: 'long diagonal a1 -> h8',
    fenBefore: '4k3/8/8/8/8/8/8/Q3K3 w - - 0 1',
    from: 'a1',
    to: 'h8',
    expected: '4k2Q/8/8/8/8/8/8/4K3 b - - 1 1',
  });

  runMoveTest({
    it: 'queen moves, castling rights unchanged',
    fenBefore: 'r3k2r/8/8/8/8/8/8/3QK2R w KQkq - 0 1',
    from: 'd1',
    to: 'd3',
    expected: 'r3k2r/8/8/8/8/3Q4/8/4K2R b KQkq - 1 1',
  });
});

describe('Kings', () => {
  runMoveTest({
    it: 'white king e1 -> e2 (one step up)',
    fenBefore: '4k3/8/8/8/8/8/8/4K3 w - - 0 1',
    from: 'e1',
    to: 'e2',
    expected: '4k3/8/8/8/8/8/4K3/8 b - - 1 1',
  });

  runMoveTest({
    it: 'white king e1 -> f2 (diagonal up-right)',
    fenBefore: '4k3/8/8/8/8/8/8/4K3 w - - 0 1',
    from: 'e1',
    to: 'f2',
    expected: '4k3/8/8/8/8/8/5K2/8 b - - 1 1',
  });

  runMoveTest({
    it: 'black king e8 -> e7 (one step down)',
    fenBefore: '4k3/8/8/8/8/8/8/4K3 b - - 0 1',
    from: 'e8',
    to: 'e7',
    expected: '8/4k3/8/8/8/8/8/4K3 w - - 1 2',
  });

  runMoveTest({
    it: 'white king e4 captures pawn on e5',
    fenBefore: '4k3/8/8/4p3/4K3/8/8/8 w - - 0 1',
    from: 'e4',
    to: 'e5',
    expected: '4k3/8/8/4K3/8/8/8/8 b - - 0 1',
  });

  runMoveTest({
    it: 'black king e5 captures pawn on e4',
    fenBefore: '8/8/8/4k3/4P3/8/8/K7 b - - 0 1',
    from: 'e5',
    to: 'e4',
    expected: '8/8/8/8/4k3/8/8/K7 w - - 0 2',
  });

  runMoveTest({
    it: 'white king moves, white castling rights removed',
    fenBefore: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
    from: 'e1',
    to: 'f1',
    expected: 'r3k2r/8/8/8/8/8/8/R4K1R b kq - 1 1',
  });

  runMoveTest({
    it: 'black king moves, black castling rights removed',
    fenBefore: 'r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1',
    from: 'e8',
    to: 'd8',
    expected: 'r2k3r/8/8/8/8/8/8/R3K2R w KQ - 1 2',
  });

  runMoveTest({
    it: 'white king moves when no castling rights',
    fenBefore: '4k3/8/8/8/8/8/8/4K3 w - - 0 1',
    from: 'e1',
    to: 'd1',
    expected: '4k3/8/8/8/8/8/8/3K4 b - - 1 1',
  });
});
