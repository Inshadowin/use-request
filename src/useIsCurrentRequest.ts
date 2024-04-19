import { useCallback, useRef } from 'react';

class Snap {
  private _snap: number;
  private _currentRef: React.MutableRefObject<number>;

  constructor(snap: number, currentRef: React.MutableRefObject<number>) {
    this._snap = snap;
    this._currentRef = currentRef;
  }

  isCurrent() {
    return this._snap === this._currentRef.current;
  }
}

export const useIsCurrentRequest = () => {
  const requestIdRef = useRef(0);

  const getSnap = useCallback(() => {
    requestIdRef.current++;

    return new Snap(requestIdRef.current, requestIdRef);
  }, []);

  return { getSnap };
};
