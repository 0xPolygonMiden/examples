//import type {Config} from 'jest';
//import {defaults} from 'jest-config';

//const config: Config = {
//  verbose: true,
//  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
//  coverageDirectory: "coverage",
//  clearMocks: true,
//  collectCoverage: true,
//};

//export default config;




module.exports = {
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/(?!lowdb|steno)"],
  transform: {
    "^.+\\.(js)?$": require.resolve("babel-jest"),
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};

export {}
