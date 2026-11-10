// One jest run with two environments:
//   - "client" tests run in jsdom (they render React components)
//   - "server" tests run in node (they boot the Express app + in-memory Mongo)
// `npm test` runs both.
const fs = require('node:fs');
const path = require('node:path');

// Use a locally installed MongoDB executable when available on Windows.
// The tests still create their own temporary database, not the installed service.
if (process.platform === 'win32' && !process.env.MONGOMS_SYSTEM_BINARY) {
  const directory = path.join(process.env.ProgramFiles || 'C:\\Program Files', 'MongoDB', 'Server');
  if (fs.existsSync(directory)) {
    const versions = fs.readdirSync(directory).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    for (const version of versions) {
      const binary = path.join(directory, version, 'bin', 'mongod.exe');
      if (fs.existsSync(binary)) {
        process.env.MONGOMS_SYSTEM_BINARY = binary;
        process.env.MONGOMS_SYSTEM_BINARY_VERSION_CHECK = 'false';
        break;
      }
    }
  }
}

module.exports = {
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/client/**/*.test.{js,jsx}'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
      },
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
      }
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/server/**/*.test.js'],
      transform: {
        '^.+\\.js$': 'babel-jest'
      }
    }
  ]
};
