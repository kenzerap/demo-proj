import { pathsToModuleNameMapper } from 'ts-jest';

export default {
  preset: 'jest-preset-angular',
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: 'tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        isolatedModules: true,
        useESM: true
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(.*\.mjs$|@angular|@ngrx|primeng|rxjs))'],
  setupFilesAfterEnv: ['./src/test-setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(
      {
        '<rootDir>/src/app/(.*)': ['<rootDir>/src/app/$1'],
        '@app/*': ['src/app/*'],
        'src/app/*': ['src/app/*'],
        '@env/*': ['src/environments/*'],
        '@core/*': ['src/app/core/*'],
        '@shared/*': ['src/app/shared/*'],
        '@features/*': ['src/app/features/*'],
      },
      {
        prefix: '<rootDir>/',
      }
    ),
  },
  coverageReporters: ['html', 'lcov', 'text-summary'],
  coverageDirectory: 'coverage',
  /* coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  }, */
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.model.ts',
    '!src/app/**/*.service.ts',
    '!src/app/**/*.const.ts',
    '!src/app/**/*.directive.ts',
    '!src/app/**/*.pipe.ts',
    '!src/app/**/*.scss',
    '!src/app/**/*.html',
    '!**/constants/**',
    '!**/stores/**',
    '!**/store/**',
    '!**/utils/**',
  ],
};
