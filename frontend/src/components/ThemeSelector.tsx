import { cn } from '../utils/class-name';
import { THEMES } from '../config';
import { useGameContext } from '../context';

type ThemeSelectorProps = Readonly<{
  className?: string;
}>;

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { themeId, changeTheme } = useGameContext();

  return (
    <div
      className={cn(
        className,
        'flex flex-col items-center gap-3',
        'bg-slate-900/80 border border-slate-700',
        'rounded-md p-3 shadow-lg backdrop-blur'
      )}
    >
      {THEMES.map((theme) => {
        const isSelected = theme.id === themeId;

        return (
          <button
            key={theme.id}
            type='button'
            onClick={() => changeTheme(theme.id)}
            className={cn(
              'relative rounded-md p-1',
              'transition-transform',
              isSelected ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 scale-105' : 'hover:scale-105'
            )}
          >
            <div className='grid grid-cols-2 grid-rows-2 size-8 rounded-sm overflow-hidden'>
              <div style={{ backgroundColor: theme.light }} />
              <div style={{ backgroundColor: theme.dark }} />
              <div style={{ backgroundColor: theme.dark }} />
              <div style={{ backgroundColor: theme.light }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
