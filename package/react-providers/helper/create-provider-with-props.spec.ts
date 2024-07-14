import { FunctionComponent } from "react";
import { default as createProviderWithProps } from "./create-provider-with-props";

describe("createProviderWithProps()", () => {
  it("should return an object with the given component", () => {
    const Component: FunctionComponent = () => {
      return null;
    };

    expect(createProviderWithProps(Component)).toEqual({
      Component,
      props: {},
    });
  });

  it("should return an object with the given component and props", () => {
    type Props = { handler: (value: unknown) => void };
    const Component: FunctionComponent<Props> = function DummyComponent() {
      return null;
    };
    const props = { handler: console.log };

    expect(createProviderWithProps(Component, props)).toEqual({
      Component,
      props,
    });
  });
});
