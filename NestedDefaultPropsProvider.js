import * as React from "react";
import {
  DefaultPropsContext,
  withDefaultProps,
} from "mergeDefaultProps/withDefaultProps";

export const NestedDefaultPropsProvider = withDefaultProps(props => {
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
