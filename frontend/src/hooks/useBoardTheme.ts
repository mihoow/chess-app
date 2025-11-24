import { useState } from 'react';
import { THEMES } from '../config';
import type { BoardThemeId } from '../type';

export function useBoardTheme() {
  const [themeId, setThemeId] = useState<BoardThemeId>(() => {
    const savedId = localStorage.getItem('board-theme');
    const isValid = savedId && THEMES.some(({ id }) => id === savedId);

    return isValid ? (savedId as BoardThemeId) : 'forest';
  });

  const changeTheme = (id: BoardThemeId) => {
    setThemeId(id);
    localStorage.setItem('board-theme', id);
  };

  return {
    themeId,
    changeTheme,
  };
}
