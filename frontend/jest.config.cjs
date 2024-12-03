/** @type {import('jest').Config} */
const config = {
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    testEnvironment: "jsdom", // Ensure it uses jsdom for DOM-related tests
    moduleFileExtensions: ["js", "jsx"],
    rootDir: ".", // Set the root directory for the tests
  };
  
  module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], // Ensure your setupTests.js file is included
  };
  
  

  