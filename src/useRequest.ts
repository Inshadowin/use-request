import { useEffect, useRef, useState } from 'react';

import { useIsMounted } from './useIsMounted';

type RequestFunctionType<T, Args extends any[] = []> = (
  cancelToken: AbortSignal,
  ...rest: Args
) => Promise<T> | T;

type UseRequestConfig<T> = {
  onFinally?: () => void;
  onSuccess?: (result: T) => void;
  onError?: ((ex: Error) => void) | false;

  isCancel?: (ex: Error) => boolean;

  deps?: any[];
};

type UseRequestResultType<T, Args extends any[] = []> = [
  (...args: Args) => Promise<T | undefined>,
  boolean
];

type GlobalConfig = Pick<UseRequestConfig<any>, 'isCancel'>;

let globalConfig: GlobalConfig = {};
export const setupGlobals = (config: GlobalConfig) => {
  globalConfig = { ...globalConfig, ...config };
};

export const useRequest = <T, Args extends any[] = []>(
  request: RequestFunctionType<T, Args>,
  config?: UseRequestConfig<T>
): UseRequestResultType<T, Args> => {
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(new AbortController());

  const { onSuccess, onFinally, onError } = config ?? {};
  const handlePerformRequest = async (...rest: Args) => {
    controllerRef.current?.abort?.();
    controllerRef.current = new AbortController();

    try {
      setLoading(true);

      const result = await request(controllerRef.current.signal, ...rest);
      if (!isMounted.current) return;

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
  };

  useEffect(() => {
    return () => {
      controllerRef.current?.abort?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, config?.deps ?? []);

  return [handlePerformRequest, loading];
};
