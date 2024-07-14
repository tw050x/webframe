import { FunctionComponent } from "react";
import { default as createProvider } from "./create-provider";

describe("createProvider()", () => {
  it("should return an object with the given component", () => {
    const Component: FunctionComponent = () => {
      return null;
    };

    expect(createProvider(Component)).toEqual({
      Component,
    });
  });

  it("should return an object with the given component and props", () => {
    type Props = { handler: (value: unknown) => void };
    const Component: FunctionComponent<Props> = function DummyComponent() {
      return null;
    };
    const props = { handler: console.log };

    expect(createProvider(Component, props)).toEqual({
      Component,
      props,
    });
  });
});
