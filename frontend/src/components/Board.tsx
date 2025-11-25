import { Square, type Color, type Coord, Position } from '@chess-app/engine';
import { useState, type PropsWithChildren, useRef } from 'react';

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
import { noop } from '../utils/misc';

export function Board() {
  const [selectedFromCoord, setSelectedFromCoord] = useState<Coord | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { board, makeMove } = useGameContext();

  const boardRef = useRef<HTMLDivElement | null>(null);
  const piecesRef = useRef<Record<Coord, HTMLElement | null>>({});

  const animateMove = async (fromPosition: Position, toPosition: Position) => {
    const { current: boardEl } = boardRef;
    const pieceEl = piecesRef.current[fromPosition.coord];

    if (!boardEl || !pieceEl) return;

    const distance = fromPosition.relativeDistanceTo(toPosition);
    const squareSize = boardEl.getBoundingClientRect().width / 8;

    const animation = pieceEl.animate(
      [
        { transform: 'translate(0, 0)' },
        { transform: `translate(${distance.x * squareSize * -1}px, ${distance.y * squareSize}px)` },
      ],
      {
        duration: 25 + 80 * Math.max(Math.abs(distance.x), Math.abs(distance.y)),
        easing: 'ease-out',
        fill: 'forwards',
      }
    );

    await animation.finished;
  };

  const handleMove = async (fromPosition: Position, toPosition: Position) => {
    setIsAnimating(true);

    const result = makeMove(fromPosition.coord, toPosition.coord);
    if (!result.ok) return;

    setSelectedFromCoord(null);
    await animateMove(fromPosition, toPosition);
    result.finalize();

    setIsAnimating(false);
  };

  return (
    <BoardFrame>
      <div
        id='board'
        className='size-[600px]'
        ref={boardRef}
      >
        {board.map(([position, square]) => (
          <BoardSquare
            key={position.coord}
            position={position}
            square={square}
            selectedFromCoord={selectedFromCoord}
            selectFromCoord={isAnimating ? noop : setSelectedFromCoord}
            makeMove={handleMove}
            pieceRef={(el) => {
              piecesRef.current[position.coord] = el;
            }}
          />
        ))}
      </div>
    </BoardFrame>
  );
}

function BoardSquare({
  square,
  position,
  selectedFromCoord,
  selectFromCoord,
  makeMove,
  pieceRef,
}: Readonly<{
  square: Square;
  position: Position;
  selectedFromCoord: Coord | null;
  isLastMovePosition: boolean;
  selectFromCoord: (coord: Coord | null) => void;
  makeMove: (fromPosition: Position, toPosition: Position) => Promise<void>;
  pieceRef: (el: HTMLElement | null) => void;
}>) {
  const { sideToMove, themeId, lastMoveCoord } = useGameContext();

  const isSelectable = square.piece && square.piece.side === sideToMove;
  const isHoverable = selectedFromCoord && square.piece?.side !== sideToMove;
  const isSelected = selectedFromCoord === position.coord;
  const isLastMovePosition = lastMoveCoord === position.coord;

  const currTheme = THEMES.find(({ id }) => id === themeId)!;
  const backgroundColor = (() => {
    if (isLastMovePosition) return 'oklch(70.7% 0.165 254.624)';

    return square.color === 'white' ? currTheme.light : currTheme.dark;
  })();

  return (
    <div
      style={{
        gridArea: position.coord,
        backgroundColor,
      }}
      className={cn(
        'group relative border border-[#3b522e] transition-colors select-none',
        'flex items-center justify-center',
        (isSelectable || isHoverable) && 'cursor-pointer',
        isSelected && 'square-shadow-blue-400',
        isHoverable && square.piece && 'hover:square-shadow-red-600'
      )}
      onClick={() => {
        if (isSelectable) {
          selectFromCoord(position.coord);
        } else if (isHoverable) {
          makeMove(Position.fromCoord(selectedFromCoord), position);
        }
      }}
    >
      {square.piece ? (
        <img
          ref={pieceRef}
          src={getImageSrc(square.piece.name, square.piece.side)}
          draggable={false}
          className={cn(
            'absolute size-6/8 inset-1/8',
            'select-none pointer-events-none',
            square.piece.side === sideToMove ? 'z-30' : 'z-20'
          )}
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
}

function BoardFrame({ children, className }: PropsWithChildren<{ className?: string }>) {
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  return (
    <div className={cn('relative p-6.5 bg-gray-100', className)}>
      <div className={cn('absolute flex items-center justify-around', 'inset-y-6.5 left-0 w-6.5 flex-col')}>
        {ranks.map((rank) => (
          <span
            key={rank}
            className='text-black text-sm'
          >
            {rank}
          </span>
        ))}
      </div>

      <div className={cn('absolute flex items-center justify-around', 'inset-x-6.5 top-0 h-6.5 flex-row')}>
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

      <div className={cn('absolute flex items-center justify-around', 'inset-y-6.5 right-0 w-6.5 flex-col')}>
        {ranks.map((rank) => (
          <span
            key={rank}
            className='text-black text-sm'
          >
            {rank}
          </span>
        ))}
      </div>

      <div className={cn('absolute flex items-center justify-around', 'inset-x-6.5 bottom-0 h-6.5 flex-row')}>
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
