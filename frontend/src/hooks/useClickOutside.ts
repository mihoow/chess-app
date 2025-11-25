import { useEffect, type RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(ref: RefObject<T | null>, callback: () => void) {
  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;

      if (!el.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [ref, callback]);
}
