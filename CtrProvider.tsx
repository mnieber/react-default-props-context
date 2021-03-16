import * as React from "react";

import { NestedDefaultPropsProvider } from "./NestedDefaultPropsProvider";

const ctrByKey: { [ctrKey: string]: any } = {};

type PropsT = React.PropsWithChildren<{
  ctrKey?: string;
  createCtr: Function;
  destroyCtr: Function;
  updateCtr: Function;
  getDefaultProps: Function;
}>;

export const CtrProvider: React.FC<PropsT> = (props: PropsT) => {
  const [ctr] = React.useState(() => {
    return props.ctrKey
      ? (ctrByKey[props.ctrKey] = ctrByKey[props.ctrKey] ?? props.createCtr())
      : props.createCtr();
  });

  React.useEffect(() => {
    const cleanUpFunction = props.updateCtr ? props.updateCtr(ctr) : undefined;
    const unmount = () => {
      if (cleanUpFunction) cleanUpFunction();
      if (!props.ctrKey) props.destroyCtr(ctr);
    };
    return unmount;
  });

  return (
    <NestedDefaultPropsProvider value={props.getDefaultProps(ctr)}>
      {props.children}
    </NestedDefaultPropsProvider>
  );
};
