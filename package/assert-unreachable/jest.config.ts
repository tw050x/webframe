import type { JestConfigWithTsJest } from "ts-jest";

const jestJUnitReporterOptions = {
  classNameTemplate: "{classname}",
  outputDirectory: "coverage/@webframe/assert-unreachable",
  outputName: "junit.xml",
  suiteName: "@webframe/assert-unreachable tests",
  titleTemplate: "{title}",
};

const config: JestConfigWithTsJest = {
  coverageDirectory: "../../coverage/@webframe/assert-unreachable",
  coverageReporters: ["clover", "json", "lcov", "text", "text-summary"],
  displayName: "@webframe/assert-unreachable",
  moduleFileExtensions: ["js", "jsx", "html", "ts", "tsx"],
  preset: "../../jest.preset.js",
  reporters: ["default", ["jest-junit", jestJUnitReporterOptions]],
  testEnvironment: "jsdom",
  transform: {
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "@nx/react/plugins/jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
      },
    ],
  },
};

export default config;
