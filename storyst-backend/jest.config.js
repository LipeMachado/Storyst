module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\.|/)(test|spec))\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.ts',
    '!app/**/*.d.ts',
    '!app/config/**',
  ],
  forceExit: true,
};