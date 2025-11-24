import { useState } from 'react';
import { cn } from '../utils/class-name';
import type { BoardThemeId } from '../type';
import { THEMES } from '../config';

type ThemeSelectorProps = Readonly<{
  className?: string;
}>;

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<BoardThemeId>('forest');

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
        const isSelected = theme.id === selectedThemeId;

        return (
          <button
            key={theme.id}
            type='button'
            onClick={() => setSelectedThemeId(theme.id)}
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
