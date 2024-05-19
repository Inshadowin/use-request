import { useCallback, useState } from 'react';

import { useIsMounted } from './useIsMounted';
import { useAbortController } from './useAbortController';
import { useIsCurrentRequest } from './useIsCurrentRequest';

export type RequestFunctionType<T, Args extends any[] = []> = (
  cancelToken: AbortSignal,
  ...rest: Args
) => Promise<T> | T;

export type UseRequestConfig<T> = {
  onFinally?: () => void;
  onSuccess?: (result: T) => void;
  onError?: ((ex: Error) => void) | false;

  isCancel?: (ex: Error) => boolean;
  resultMiddleware?: (result: Awaited<T>) => void;

  deps?: any[];
};

export type UseRequestResultType<T, Args extends any[] = []> = [
  (...args: Args) => Promise<T | undefined>,
  boolean
];

export type GlobalConfig = Pick<
  UseRequestConfig<any>,
  'isCancel' | 'resultMiddleware'
>;

let globalConfig: GlobalConfig = {};
export const setupGlobals = (config: GlobalConfig) => {
  globalConfig = { ...globalConfig, ...config };
};

export const useRequest = <T, Args extends any[] = []>(
  request: RequestFunctionType<T, Args>,
  config?: UseRequestConfig<T>
): UseRequestResultType<T, Args> => {
  const isMounted = useIsMounted();
  const { getSnap } = useIsCurrentRequest();
  const [loading, setLoading] = useState(false);
  const controller = useAbortController(config.deps);

  const handlePerformRequest = useCallback(async (...rest: Args) => {
    const { onSuccess, onFinally, onError } = config ?? {};

    controller.abort();
    const snap = getSnap();

    try {
      setLoading(true);

      const result = await request(controller.signal(), ...rest);
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
