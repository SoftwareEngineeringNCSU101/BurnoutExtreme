// jest.config.js
module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest", // this will tell Jest to use Babel for transforming files
    },
  };
  