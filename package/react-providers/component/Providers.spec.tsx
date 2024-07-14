import { render } from "@testing-library/react";
import { FunctionComponent, PropsWithChildren } from "react";

import { default as Providers } from "./Providers";
import { default as createProvider } from "../helper/create-provider";

describe("<Provider />", () => {
  it("should return children if no providers are given", () => {
    const { getByText } = render(
      <Providers providers={[]}>
        <div>Test</div>
      </Providers>
    );

    expect(getByText("Test")).toBeDefined();
  });

  const TestProvider: FunctionComponent<
    PropsWithChildren<{ test: "value" }>
  > = ({ children }) => {
    return <div>{children}</div>;
  };

  it("should return children wrapped with the given providers", () => {
    const { debug, getByText } = render(
      <Providers
        providers={[
          createProvider(TestProvider, { test: "value" }),
          createProvider(({ children }) => <div>{children}</div>),
        ]}
      >
        <div>Test</div>
      </Providers>
    );

    expect(getByText("Test")).toBeDefined();

    debug();
  });
});
