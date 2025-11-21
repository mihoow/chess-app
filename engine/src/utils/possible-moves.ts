import { Board, Controller } from '../controllers';
import { Move } from '../moves';
import { Piece } from '../pieces';
import { Color, Coord, MovePayload } from '../types';
import { Position } from './position';

type Filters = {
  side?: Color;
};

export class PossibleMoves {
  private board: Board;
  private possibleMoves: Map<Piece, Map<Coord, Move>>;

  constructor(controller: Controller, filters: Filters = {}) {
    // TODO: implement memoization to optimize performance
    this.possibleMoves = this.generatePossibleMoves(controller, filters.side || null);
    this.board = controller.board;
  }

  private generatePossibleMoves(controller: Controller, side: Color | null): Map<Piece, Map<Coord, Move>> {
    const possibleMoves = new Map<Piece, Map<Coord, Move>>();

    controller.board.forEachSquare((position, square) => {
      const piece = square.piece;
      if (!piece) return;
      if (piece.side !== side) return;

      possibleMoves.set(piece, piece.generatePossibleMoves(position, controller));
    });

    return possibleMoves;
  }

  findMove({ from, to }: MovePayload): Move | null {
    const piece = this.board.getSquare(Position.fromCoord(from))?.piece;
    if (!piece) return null;

    const pieceMoves = this.possibleMoves.get(piece);

    return pieceMoves?.get(to) || null;
  }

  getMovesToPosition(toPosition: Position) {
    const movesToPosition: Move[] = [];

    this.possibleMoves.forEach((pieceMoves) => {
      if (pieceMoves.has(toPosition.coord)) {
        movesToPosition.push(pieceMoves.get(toPosition.coord)!);
      }
    });

    return movesToPosition;
  }
}
