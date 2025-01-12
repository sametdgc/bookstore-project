module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "src"], 
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1", 
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], 
};