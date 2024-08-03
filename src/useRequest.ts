import { useCallback, useRef, useState } from 'react';

import { useIsMounted } from './useIsMounted';
import { useAbortController } from './useAbortController';
import { useIsCurrentRequest } from './useIsCurrentRequest';
import type {
  GlobalConfig,
  UseRequestConfig,
  CancelablePromise,
  RequestFunctionType,
  UseRequestResultType,
} from './types';

let globalConfig: GlobalConfig = {};
export const setupGlobals = (config: GlobalConfig) => {
  globalConfig = { ...globalConfig, ...config };
};

const isCancelable = <T>(promise: unknown): promise is CancelablePromise<T> => {
  return (
    !!promise &&
    typeof promise === 'object' &&
    'cancel' in promise &&
    typeof promise['cancel'] === 'function'
  );
};

export const useRequest = <T, Args extends any[] = []>(
  request: RequestFunctionType<T, Args>,
  config?: UseRequestConfig<T>
): UseRequestResultType<T, Args> => {
  const isMounted = useIsMounted();
  const { getSnap } = useIsCurrentRequest();
  const promiseRef = useRef<Promise<T> | T>(null);
  const [loading, setLoading] = useState(false);
  const controller = useAbortController(config.deps);

  const handlePerformRequest = useCallback(async (...rest: Args) => {
    const { onSuccess, onFinally, onError } = config ?? {};

    controller.abort();
    if (isCancelable(promiseRef.current)) {
      promiseRef.current.cancel();
    }
    const snap = getSnap();

    try {
      setLoading(true);

      promiseRef.current = request(controller.signal(), ...rest);
      const result = await promiseRef.current;

      if (!snap.isCurrent() || !isMounted.current) return;

      config?.resultMiddleware?.(result);
      globalConfig?.resultMiddleware?.(result);

      onSuccess?.(result);
      return result;
    } catch (ex: any) {
      const isCancel = config?.isCancel || globalConfig?.isCancel;
      if (!isMounted.current || isCancel?.(ex)) return;

      !!onError && onError?.(ex);
    } finally {
      if (!isMounted.current) return;

      setLoading(false);
      onFinally?.();
    }
  }, config.deps ?? []);

  return [handlePerformRequest, loading];
};
