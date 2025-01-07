import { appendFile } from "fs/promises";

import { default as WriteMessageToFileArray } from "./index";

jest.mock("fs/promises", () => ({
  appendFile: jest.fn(),
}));

describe("WriteMessageToFileArray()", () => {
  it("should construct a WriteMessageToFileArray() class with the file path", () => {
    const constructWriteMessageToFileArray = () =>
      new WriteMessageToFileArray("test.txt");
    expect(constructWriteMessageToFileArray).not.toThrow();
  });

  it("should construct a WriteMessageToFileArray() class with the file path", () => {
    const filePath = "test.txt";
    const constructWriteMessageToFileArray = () =>
      new WriteMessageToFileArray({ filePath });
    expect(constructWriteMessageToFileArray).not.toThrow();
  });

  it("should call fs.appendFile() when pushing a message to the array", () => {
    const filePath = "test.txt";
    const writeMessageToFileArray = new WriteMessageToFileArray(filePath);
    writeMessageToFileArray.push("Test message");
    expect(appendFile).toHaveBeenCalled();
  });
});
