import '@localization/config';
// import './__mocks__/zustand';

jest.useFakeTimers();
jest.mock('zustand');

/**
 * Mock helmet module
 */
jest.mock('react-helmet-async', () => ({
  Helmet: jest.fn(({ children }) => <div>{children}</div>),
  HelmetProvider: () => jest.fn(),
}));
