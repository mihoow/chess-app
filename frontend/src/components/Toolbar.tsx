import { cn } from '../utils/class-name';
import { useGameContext } from '../context';

type ToolbarProps = Readonly<{
  className?: string;
  onPrev?: () => void;
  onNext?: () => void;
}>;

export function Toolbar({ className, onPrev, onNext }: ToolbarProps) {
  const { sideToMove, reset } = useGameContext();

  const handleResetClick = () => {
    if (window.confirm('Reset the game?')) {
      reset();
    }
  };

  const sideLabel = sideToMove === 'white' ? 'White to move' : 'Black to move';
  const sideDotClass = sideToMove === 'white' ? 'bg-slate-100' : 'bg-slate-900 border border-slate-200';

  return (
    <div
      className={cn(
        className,
        'flex items-center justify-between',
        'bg-slate-900/80 border border-slate-700',
        'rounded-md h-14 px-4 shadow-lg backdrop-blur'
      )}
    >
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-3 rounded-md px-3 py-1'>
          <div className='flex items-center gap-2'>
            <span className={cn('h-3 w-3 rounded-full', 'shadow-sm', sideDotClass)} />
            <span className='text-sm leading-none font-medium text-slate-200'>{sideLabel}</span>
          </div>
        </div>

        <div className='inline-flex rounded-md shadow-sm overflow-hidden border border-slate-700'>
          <button
            type='button'
            onClick={onPrev}
            className={cn(
              'px-3 h-8 text-xs font-medium',
              'bg-slate-800 text-slate-200',
              'hover:bg-slate-700',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              'transition-colors'
            )}
          >
            ◀
          </button>
          <button
            type='button'
            onClick={onNext}
            className={cn(
              'px-3 h-8 text-xs font-medium',
              'bg-slate-800 text-slate-200 border-l border-slate-700',
              'hover:bg-slate-700',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              'transition-colors'
            )}
          >
            ▶
          </button>
        </div>
      </div>

      <button
        type='button'
        onClick={handleResetClick}
        className={cn(
          'inline-flex items-center gap-2',
          'px-3 h-8 rounded-md',
          'bg-slate-800 text-slate-200',
          'hover:bg-slate-700',
          'text-xs font-semibold tracking-wide uppercase',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
          'transition-colors'
        )}
      >
        <span className='text-sm leading-none'>Reset</span>
      </button>
    </div>
  );
}
