import * as React from "react";

import { NestedDefaultPropsProvider } from "./NestedDefaultPropsProvider";

const ctrByKey: { [ctrKey: string]: any } = {};

type PropsT = React.PropsWithChildren<{
  ctrKey?: string;
  createCtr: Function;
  updateCtr: Function;
  getDefaultProps: Function;
}>;

export const CtrProvider: React.FC<PropsT> = (props: PropsT) => {
  const [ctr] = React.useState(() => {
    const ctr = (props.ctrKey && ctrByKey[props.ctrKey]) ?? props.createCtr();
    if (props.ctrKey) ctrByKey[props.ctrKey] = ctr;
    return ctr;
  });

  React.useEffect(() => {
    return props.updateCtr ? props.updateCtr(ctr) : undefined;
  });

  return (
    <NestedDefaultPropsProvider value={props.getDefaultProps(ctr)}>
      {props.children}
    </NestedDefaultPropsProvider>
  );
};
