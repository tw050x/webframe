import { FunctionComponent, PropsWithChildren } from "react";
import { default as createProvider } from "./create-provider";

const ComponentOne: FunctionComponent<{ number: 1 }> = () => {
  return null;
};

// @ts-expect-error - should throw due to prop mismatch
createProvider(ComponentOne, { string: "test" });

// - should
createProvider(ComponentOne, { number: 1 });

// @ts-expect-error - should throw due to missing props
createProvider(ComponentOne, {});

// @ts-expect-error - should throw due to missing props
createProvider(ComponentOne);

const ComponentTwo: FunctionComponent = () => {
  return null;
};

// @ts-expect-error - should throw due to prop mismatch
createProvider(ComponentTwo, { string: "test" });

// @ts-expect-error - should throw due to prop mismatch
createProvider(ComponentTwo, { number: 1 });

//
createProvider(ComponentTwo, {});

//
createProvider(ComponentTwo);

const ComponentThree = ({ string }: { string: "test" }) => {
  return string;
};

//
createProvider(ComponentThree, { string: "test" });

// @ts-expect-error - should throw due to prop mismatch
createProvider(ComponentThree, { number: 1 }); // should throw

// @ts-expect-error - should throw due to missing props
createProvider(ComponentThree, {});

// @ts-expect-error - should throw due to missing props
createProvider(ComponentThree);

const ComponentFour = () => {
  return null;
};

// @ts-expect-error - should throw due to prop mismatch
createProvider(ComponentFour, { string: "test" });

// @ts-expect-error - should throw due to prop mismatch
createProvider(ComponentFour, { number: 1 });

//
createProvider(ComponentFour, {});

//
createProvider(ComponentFour);

const ComponentFive: FunctionComponent<
  PropsWithChildren<{ number: 1 }>
> = () => {
  return null;
};

// @ts-expect-error - should throw due to prop mismatch
createProvider(ComponentFive, { string: "test" });

//
createProvider(ComponentFive, { number: 1 });

// @ts-expect-error - should throw due to missing props
createProvider(ComponentFive, {});

// @ts-expect-error - should throw due to missing props
createProvider(ComponentFive);
