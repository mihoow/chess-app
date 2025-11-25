import { useEffect, useRef } from 'react';

export function useWait<T = void>() {
  const resolveRef = useRef<(value: T | null) => void | null>(null);

  const startWaiting = () =>
    new Promise<T | null>((resolve) => {
      resolveRef.current = resolve;
    });

  const stopWaiting = (value: T) => {
    resolveRef.current?.(value);
    resolveRef.current = null;
  };

  useEffect(() => {
    return () => {
      resolveRef.current?.(null);
      resolveRef.current = null;
    };
  }, []);

  return [startWaiting, stopWaiting] as const;
}
