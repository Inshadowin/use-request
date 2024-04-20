import { useCallback, useEffect, useRef } from 'react';

export const useAbortController = (deps: any[] = []) => {
  const controllerRef = useRef(new AbortController());

  const abort = useCallback(() => {
    controllerRef.current?.abort?.();
    controllerRef.current = new AbortController();
  }, []);

  const signal = useCallback(() => {
    return controllerRef.current.signal;
  }, []);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort?.();
    };
  }, deps ?? []);

  return { abort, signal };
};
