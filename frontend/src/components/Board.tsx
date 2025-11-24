import { Game, type Color, type Coord } from '@chess-app/engine';
import { useState, type ReactNode, type PropsWithChildren } from 'react';

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
import { cn } from '../utils/class-name';
import { useGameContext } from '../context';
import { THEMES } from '../config';

function getImageSrc(pieceName: string, side: Color) {
  switch (pieceName) {
    case 'Pawn':
      return side === 'white' ? wPawn : bPawn;
    case 'Rook':
      return side === 'white' ? wRook : bRook;
    case 'Knight':
      return side === 'white' ? wKnight : bKnight;
    case 'Bishop':
      return side === 'white' ? wBishop : bBishop;
    case 'Queen':
      return side === 'white' ? wQueen : bQueen;
    case 'King':
      return side === 'white' ? wKing : bKing;
  }
}

export function Board() {
  const [selectedFromCoord, setSelectedFromCoord] = useState<Coord | null>(null);
  const { sideToMove, board, themeId, makeMove } = useGameContext();

  const currTheme = THEMES.find(({ id }) => id === themeId)!;

  const squares: ReactNode[] = [];
  board.forEach(([position, square]) => {
    const isSelectable = square.piece && square.piece.side === sideToMove;
    const isHoverable = selectedFromCoord && square.piece?.side !== sideToMove;
    const isSelected = selectedFromCoord === position.coord;

    squares.push(
      <div
        key={position.coord}
        style={{
          gridArea: position.coord,
          backgroundColor: square.color === 'white' ? currTheme.light : currTheme.dark,
        }}
        className={cn(
          'group relative border border-[#3b522e] transition-colors select-none',
          'flex items-center justify-center',
          (isSelectable || isHoverable) && 'cursor-pointer',
          isSelected && 'square-shadow-blue-600',
          isHoverable && square.piece && 'hover:square-shadow-red-600'
        )}
        onClick={() => {
          if (isSelectable) {
            setSelectedFromCoord(position.coord);
          } else if (isHoverable) {
            const result = makeMove(selectedFromCoord, position.coord);
            if (!result.ok) return;

            setSelectedFromCoord(null);
            result.finalize();
          }
        }}
      >
        {square.piece ? (
          <img
            src={getImageSrc(square.piece.name, square.piece.side)}
            draggable={false}
            className={cn('absolute size-6/8 inset-1/8', 'select-none pointer-events-none')}
          />
        ) : (
          <div
            className={cn(
              'static rounded-full transition-colors',
              square.piece ? 'size-full' : 'size-2/5',
              isHoverable && !square.piece && 'group-hover:bg-yellow-600'
            )}
          />
        )}
      </div>
    );
  });

  return (
    <BoardFrame>
      <div
        id='board'
        className='size-[600px] border-2 border-gray-100'
      >
        {squares}
      </div>
    </BoardFrame>
  );
}

function BoardFrame({ children, className }: PropsWithChildren<{ className?: string }>) {
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  return (
    <div className={cn('relative p-6 bg-gray-100', className)}>
      <div className={cn('absolute flex items-center justify-around', 'inset-y-6 left-0 w-6 flex-col')}>
        {ranks.map((rank) => (
          <span
            key={rank}
            className='text-black text-sm'
          >
            {rank}
          </span>
        ))}
      </div>

      <div className={cn('absolute flex items-center justify-around', 'inset-x-6 top-0 h-6 flex-row')}>
        {files.map((file) => (
          <span
            key={file}
            className='text-black text-sm'
          >
            {file}
          </span>
        ))}
      </div>

      {children}

      <div className={cn('absolute flex items-center justify-around', 'inset-y-6 right-0 w-6 flex-col')}>
        {ranks.map((rank) => (
          <span
            key={rank}
            className='text-black text-sm'
          >
            {rank}
          </span>
        ))}
      </div>

      <div className={cn('absolute flex items-center justify-around', 'inset-x-6 bottom-0 h-6 flex-row')}>
        {files.map((file) => (
          <span
            key={file}
            className='text-black text-sm'
          >
            {file}
          </span>
        ))}
      </div>
    </div>
  );
}
