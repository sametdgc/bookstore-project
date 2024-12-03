/** @type {import('jest').Config} */
const config = {
    "testMatch": ["**/?(*.)+(test).[jt]s?(x)"],
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    testEnvironment: "jsdom", // it uses jsdom for DOM-related tests
    moduleFileExtensions: ["js", "jsx"],
    rootDir: ".", 
  };
  
  module.exports = config;

  