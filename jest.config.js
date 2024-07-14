module.exports = {
  verbose: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.js'],
  roots: ['./'],
  testEnvironment: 'jsdom',
  coverageReporters: ['lcov'],
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    // exclude files from coverage
    '!src/**/index.ts',
    '!src/**/index.tsx',
    '!src/**/App.tsx',
    '!src/**/react-app-env.d.ts',
    '!src/**/reportWebVitals.ts',
    '!src/**/setupTests.ts',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '@assets': '<rootDir>/src/assets',
    '@dash-ui': '<rootDir>/src/components',
    '@provider': '<rootDir>/src/provider',
    '@localization': '<rootDir>/src/localization',
    '@router': '<rootDir>/src/router',
    '@router/*': '<rootDir>/src/router/*',
    '@screens': '<rootDir>/src/screens',
    '@screens/*': '<rootDir>/src/screens/*',
    '@service': '<rootDir>/src/service',
    '@service/*': '<rootDir>/src/service/*',
    '@store': '<rootDir>/src/store',
    '@store/slice': '<rootDir>/src/store/slice',
    '@selectors': '<rootDir>/src/store/selectors',
    '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  transform: {
    '.+\\.(css|scss|png|jpg|jpeg|svg)$': 'jest-transform-stub',
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  // coverageThreshold: {
  //   global: {
  //     branches: 0,
  //     functions: 0,
  //     lines: 0,
  //     statements: -1000,
  //   },
  // },
};
