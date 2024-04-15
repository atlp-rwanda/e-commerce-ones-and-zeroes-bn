module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
};

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   roots: ['<rootDir>/src'],
//   transform: {
//     '^.+\\.tsx?$': 'ts-jest',
//   },
//   moduleDirectories: ['node_modules', 'src'],
//   globals: {
//     'ts-jest': {
//       tsconfig: 'tsconfig.json',
//     },
//   },
// };
