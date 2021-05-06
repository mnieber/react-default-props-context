import * as React from "react";

import { NestedDefaultPropsProvider } from "./NestedDefaultPropsProvider";

type PropsT = React.PropsWithChildren<{
  createCtr: Function;
  destroyCtr: Function;
  updateCtr: Function;
  getDefaultProps: Function;
}>;

export const CtrProvider: React.FC<PropsT> = (props: PropsT) => {
  const [ctr] = React.useState(() => {
    return props.createCtr();
  });

  React.useEffect(() => {
    const cleanUpFunction = props.updateCtr ? props.updateCtr(ctr) : undefined;
    const unmount = () => {
      if (cleanUpFunction) cleanUpFunction();
      props.destroyCtr(ctr);
    };
    return unmount;
  });

  return (
    <NestedDefaultPropsProvider value={props.getDefaultProps(ctr)}>
      {props.children}
    </NestedDefaultPropsProvider>
  );
};
