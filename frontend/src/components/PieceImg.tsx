import wPawn from '../assets/white-pawn-svgrepo-com.svg';
import wRook from '../assets/white-rook-svgrepo-com.svg';
import wKnight from '../assets/white-knight-svgrepo-com.svg';
import wBishop from '../assets/white-bishop-svgrepo-com.svg';
import wQueen from '../assets/white-queen-svgrepo-com.svg';
import wKing from '../assets/white-king-svgrepo-com.svg';

import bPawn from '../assets/black-pawn-svgrepo-com.svg';
import bRook from '../assets/black-rook-svgrepo-com.svg';
import bKnight from '../assets/black-knight-svgrepo-com.svg';
import bBishop from '../assets/black-bishop-svgrepo-com.svg';
import bQueen from '../assets/black-queen-svgrepo-com.svg';
import bKing from '../assets/black-king-svgrepo-com.svg';

import { PieceID, type Color } from '@chess-app/engine';
import type { Ref } from 'react';

export function PieceImg({
  pieceId,
  side,
  ref,
  className,
}: Readonly<{ pieceId: PieceID; side: Color; ref?: Ref<HTMLImageElement>; className?: string }>) {
  return (
    <img
      ref={ref}
      src={getImageSrc(pieceId, side)}
      className={className}
    />
  );
}

function getImageSrc(pieceID: PieceID, side: Color) {
  switch (pieceID) {
    case PieceID.Pawn:
      return side === 'white' ? wPawn : bPawn;
    case PieceID.Rook:
      return side === 'white' ? wRook : bRook;
    case PieceID.Knight:
      return side === 'white' ? wKnight : bKnight;
    case PieceID.Bishop:
      return side === 'white' ? wBishop : bBishop;
    case PieceID.Queen:
      return side === 'white' ? wQueen : bQueen;
    case PieceID.King:
      return side === 'white' ? wKing : bKing;
  }
}
