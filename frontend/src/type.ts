export type BoardThemeId = 'classic' | 'forest' | 'dark';

export type BoardTheme = {
  id: BoardThemeId;
  light: string;
  dark: string;
};