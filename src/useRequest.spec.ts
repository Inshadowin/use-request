import { setupGlobals } from './useRequest';

describe('useRequest configuration happy path', () => {
  it('accepts global success middleware configuration', () => {
    const resultMiddleware = jest.fn();

    expect(() => setupGlobals({ resultMiddleware })).not.toThrow();
  });

  it('accepts global cancellation configuration', () => {
    const isCancel = jest.fn(() => true);

    expect(() => setupGlobals({ isCancel })).not.toThrow();
  });
});
