import { Board } from '../state';
import { Move } from '../moves';
import { Piece } from '../pieces';
import { Color, Coord, MovePayload } from '../types';
import { Position } from './position';
import { IController } from '../controller';

type Filters = {
  side?: Color;
};

export class PossibleMoves {
  private board: Board;
  private possibleMoves: Map<Piece, Map<Coord, Move>>;

  constructor(controller: IController, filters: Filters = {}) {
    // TODO: implement memoization to optimize performance
    this.possibleMoves = this.generatePossibleMoves(controller, filters);
    this.board = controller.board;
  }

  private generatePossibleMoves(controller: IController, filters: Filters): Map<Piece, Map<Coord, Move>> {
    const possibleMoves = new Map<Piece, Map<Coord, Move>>();

    controller.board.forEachSquare((position, square) => {
      const piece = square.piece;
      if (!piece) return;
      if (filters.side && piece.side !== filters.side) return;

      possibleMoves.set(piece, piece.generatePossibleMoves(position, controller));
    });

    return possibleMoves;
  }

  findMove({ from, to, advancesTo }: MovePayload): Move | null {
    const piece = this.board.getSquare(Position.fromCoord(from))?.piece;
    if (!piece) return null;

    const pieceMoves = this.possibleMoves.get(piece);

    const move = pieceMoves?.get(to);
    if (!move) return null;

    move.setOptions({ advancesTo });
    return move;
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
