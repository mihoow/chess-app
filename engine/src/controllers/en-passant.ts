import { Move, SimpleMove } from '../moves';
import { Pawn } from '../pieces';
import { InternalStateException } from '../utils';
import { Position } from '../utils/position';
import { Board } from './board';
import { Controller } from './controller';

export class EnPassant {
  readonly targetPosition: Position | null;

  static fromFEN(targetCoord: string) {
    return new this(targetCoord === '-' ? null : Position.fromCoord(targetCoord));
  }

  constructor(targetPosition: Position | null) {
    this.targetPosition = targetPosition;
  }

  afterMove(move: Move, { ply }: Controller, newBoard: Board): EnPassant {
    const isPawnDoubleMove =
      move instanceof SimpleMove && move.piece instanceof Pawn && move.from.distanceTo(move.to).y === 2;

    if (!isPawnDoubleMove) return new EnPassant(null);

    const enPassantTarget = ply.sideToMove === 'white' ? move.to.moveY(-1) : move.to.moveY(1);
    if (!enPassantTarget) throw new InternalStateException();

    return new EnPassant(enPassantTarget);
  }

  toFEN() {
    return this.targetPosition ? this.targetPosition.coord : '-';
  }
}
