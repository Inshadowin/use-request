export type CancelablePromise<T> = Promise<T> & { cancel: () => void };
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
