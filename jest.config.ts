import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'], // Усі файли, що закінчуються на .test.ts
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  clearMocks: true,
  verbose: true,
};

export default config;
