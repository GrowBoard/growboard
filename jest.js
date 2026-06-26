import '@localization/config';

if (typeof global.structuredClone !== 'function') {
  const clone = (val) => {
    if (val === undefined) return undefined;
    const str = JSON.stringify(val);
    if (str === undefined) return undefined;
    return JSON.parse(str);
  };
  global.structuredClone = clone;
  if (typeof window !== 'undefined') {
    window.structuredClone = clone;
  }
}

jest.useFakeTimers();
jest.mock('zustand');

/**
 * Mock helmet module
 */
jest.mock('react-helmet-async', () => ({
  Helmet: jest.fn(({ children }) => <div>{children}</div>),
  HelmetProvider: () => jest.fn(),
}));
