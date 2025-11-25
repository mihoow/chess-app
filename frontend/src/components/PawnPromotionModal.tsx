import { PieceID, type Piece, type AdvancesTo } from '@chess-app/engine';
import { Modal } from './Modal';
import { PieceImg } from './PieceImg';
import { cn } from '../utils/class-name';
import { noop } from '../utils/misc';

const promotionLabels: Record<AdvancesTo, string> = {
  [PieceID.Queen]: 'Queen',
  [PieceID.Rook]: 'Rook',
  [PieceID.Bishop]: 'Bishop',
  [PieceID.Knight]: 'Knight',
};

export function PawnPromotionModal({
  promotedPawn,
  onDone,
}: Readonly<{ promotedPawn: Piece | null; onDone: (pieceChoice: AdvancesTo) => void }>) {
  return (
    <Modal
      open={!!promotedPawn}
      onOpenChange={noop}
      isClosable={false}
      title='Promotion'
      description='Choose a piece to promote your pawn into:'
    >
      {promotedPawn && (
        <div className='mt-4 grid grid-cols-2 gap-4'>
          {[PieceID.Rook, PieceID.Knight, PieceID.Bishop, PieceID.Queen].map((pieceId) => {
            const choice = pieceId as AdvancesTo;

            return (
              <button
                key={pieceId}
                type='button'
                onClick={() => onDone(choice)}
                className={cn(
                  'group relative flex items-center justify-center',
                  'aspect-square rounded-xl cursor-pointer',
                  'bg-linear-to-b from-slate-600 to-slate-900',
                  'border border-slate-500/70',
                  // convex: jasny highlight + ciemny cień
                  'shadow-[0_6px_0_rgba(15,23,42,1),0_0_0_1px_rgba(15,23,42,0.6)]',
                  'hover:from-slate-500 hover:to-slate-800',
                  'hover:shadow-[0_4px_0_rgba(15,23,42,1),0_0_0_1px_rgba(15,23,42,0.8)]',
                  'active:translate-y-0.5 active:shadow-[0_2px_0_rgba(15,23,42,1),0_0_0_1px_rgba(15,23,42,0.9)]',
                  'transition-shadow',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'
                )}
              >
                <div className='flex flex-col items-center gap-1'>
                  <PieceImg
                    pieceId={pieceId}
                    side={promotedPawn.side}
                    className={cn(
                      'w-12 h-12 md:w-16 md:h-16',
                      'drop-shadow-[0_0_6px_rgba(0,0,0,0.7)]',
                      'transition-transform group-hover:scale-105'
                    )}
                  />
                  <span className='text-xs font-medium text-slate-200'>{promotionLabels[choice]}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
