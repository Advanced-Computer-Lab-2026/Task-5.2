module.exports = {
  testMatch: ['<rootDir>/tests/**/*.test.[jt]s?(x)'],
  testEnvironment: 'node',
  transform: { '^.+\\.[cm]?[jt]sx?$': 'babel-jest' },
};
