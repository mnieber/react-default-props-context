import * as React from "react";

import { DefaultPropsContext, withDefaultProps } from "./withDefaultProps";

export const NestedDefaultPropsProvider = withDefaultProps((props: any) => {
  const value = {
    ...(props.defaultProps || {}),
    ...props.value,
  };

  return (
    <DefaultPropsContext.Provider value={value}>
      {props.children}
    </DefaultPropsContext.Provider>
  );
});
