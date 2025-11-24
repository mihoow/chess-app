import { useEffect, useState } from 'react';
import type { IHistory } from '../type';
import { INITIAL_FEN } from '@chess-app/engine';

const HISTORY_INDEX_KEY = 'history-key';
const HISTORY_LIST_KEY = 'history';

export type LocalHistory = {
  history: string[];
  historyIndex: number;
  currentFEN: string;
  canGoBack: boolean;
  canGoForward: boolean;
  push: (fen: string) => void;
  goBack: () => string | null;
  goForward: () => string | null;
  reset: () => void;
};

export function useHistory(): LocalHistory {
  const [historyIndex, setHistoryIndex] = useState<number>(() => {
    const savedIndex = sessionStorage.getItem(HISTORY_INDEX_KEY);

    return isNaN(Number(savedIndex)) ? 0 : Number(savedIndex);
  });

  const [history, setHistory] = useState<string[]>(() => {
    const savedHistory = sessionStorage.getItem(HISTORY_LIST_KEY);

    if (!savedHistory) {
      return [INITIAL_FEN];
    }

    try {
      const history = JSON.parse(savedHistory);

      if (Array.isArray(history) && history.every((item) => typeof item === 'string')) {
        return history;
      }

      sessionStorage.removeItem(HISTORY_LIST_KEY);
      throw new Error('Invalid history');
    } catch {
      return [INITIAL_FEN];
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

  return {
    history,
    historyIndex,
    currentFEN: history[historyIndex],
    canGoBack,
    canGoForward,
    push: (fen: string) => {
      if (historyIndex === history.length - 1) {
        setHistory([...history, fen]);
        setHistoryIndex(historyIndex + 1);
      } else {
        setHistory([...history.slice(0, historyIndex + 1), fen]);
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
      setHistory([INITIAL_FEN]);
      setHistoryIndex(0);
    },
  };
}

export function useHistoryApi(history: LocalHistory, callback: (fen: string) => void): IHistory {
  return {
    canGoBack: history.canGoBack,
    canGoForward: history.canGoForward,
    goBack: () => {
      const prevFEN = history.goBack();
      if (!prevFEN) return;

      callback(prevFEN);
    },
    goForward: () => {
      const nextFEN = history.goForward();
      if (!nextFEN) return;

      callback(nextFEN);
    },
  };
}
