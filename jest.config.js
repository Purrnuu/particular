module.exports = {
  testURL: 'http://localhost',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  modulePaths: ['src'],
  moduleNameMapper: {
    'icon\\-components\\/(.*)\\.svg$': '<rootDir>/src/__mocks__/svgComponentMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  modulePathIgnorePatterns: ['.cache', 'npm-cache', '.npm'],
  globals: {
    window: true,
  },
};
