import { useEffect, useState } from 'react';
import type { IHistory } from '../type';
import { INITIAL_FEN, type Coord } from '@chess-app/engine';

const HISTORY_INDEX_KEY = 'history-key';
const HISTORY_LIST_KEY = 'history';

export type LocalHistory = {
  currentFEN: string;
  lastMoveCoord: Coord | null;
  canGoBack: boolean;
  canGoForward: boolean;
  push: (fen: string, toCoord: Coord) => void;
  goBack: () => [string, Coord | null] | null;
  goForward: () => [string, Coord | null] | null;
  reset: () => void;
};

export function useHistory(): LocalHistory {
  const [historyIndex, setHistoryIndex] = useState<number>(() => {
    const savedIndex = sessionStorage.getItem(HISTORY_INDEX_KEY);

    return isNaN(Number(savedIndex)) ? 0 : Number(savedIndex);
  });

  const [history, setHistory] = useState<[string, Coord | null][]>(() => {
    const savedHistory = sessionStorage.getItem(HISTORY_LIST_KEY);

    if (!savedHistory) {
      return [[INITIAL_FEN, null]];
    }

    try {
      const history = JSON.parse(savedHistory);

      if (Array.isArray(history) && history.every((item) => Array.isArray(item) && item.length === 2)) {
        return history;
      }

      sessionStorage.removeItem(HISTORY_LIST_KEY);
      throw new Error('Invalid history');
    } catch {
      return [[INITIAL_FEN, null]];
    }
  });

  useEffect(() => {
    sessionStorage.setItem(HISTORY_INDEX_KEY, String(historyIndex));
  }, [historyIndex]);

  useEffect(() => {
    sessionStorage.setItem(HISTORY_LIST_KEY, JSON.stringify(history));
  }, [history]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;
  const [currentFEN, lastMoveCoord] = history[historyIndex];

  return {
    currentFEN: currentFEN,
    lastMoveCoord,
    canGoBack,
    canGoForward,
    push: (fen: string, toCoord: Coord) => {
      if (historyIndex === history.length - 1) {
        setHistory([...history, [fen, toCoord]]);
        setHistoryIndex(historyIndex + 1);
      } else {
        setHistory([...history.slice(0, historyIndex + 1), [fen, toCoord]]);
        setHistoryIndex(historyIndex + 1);
      }
    },
    goBack: () => {
      if (!canGoBack) return null;

      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);

      return history[prevIndex];
    },
    goForward: () => {
      if (!canGoForward) return null;

      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);

      return history[nextIndex];
    },
    reset: () => {
      setHistory([[INITIAL_FEN, null]]);
      setHistoryIndex(0);
    },
  };
}

export function useHistoryApi(
  history: LocalHistory,
  callback: (fen: string, lastMoveCoord: Coord | null) => void
): IHistory {
  return {
    canGoBack: history.canGoBack,
    canGoForward: history.canGoForward,
    lastMoveCoord: history.lastMoveCoord,
    goBack: () => {
      const prevEntry = history.goBack();
      if (!prevEntry) return;

      callback(...prevEntry);
    },
    goForward: () => {
      const nextEntry = history.goForward();
      if (!nextEntry) return;

      callback(...nextEntry);
    },
  };
}
