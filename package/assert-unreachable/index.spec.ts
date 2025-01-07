import { default as assertUnreachable } from "./index";

describe("assertUnreachable()", () => {
  it("should throw an error when called", () => {
    const message = "an error message";
    expect(() => assertUnreachable({} as never, message)).toThrow(message);
  });
});
