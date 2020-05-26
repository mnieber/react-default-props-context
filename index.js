// @flow

import * as React from "react";
export { withDefaultProps } from "mergeDefaultProps/withDefaultProps";
export { NestedDefaultPropsProvider } from "mergeDefaultProps/NestedDefaultPropsProvider";

type PropsT = {
  children: any,
  value: { ... },
  defaultProps: { ... },
};

export const mergeDefaultProps = <T>(props: any): T => {
  if (!props.defaultProps) {
    console.error("No default props: ", props);
  }
  return new Proxy(props, {
    get: function(obj, prop) {
      if (prop in obj) {
        return obj[prop];
      }
      if (prop in props.defaultProps) {
        return props.defaultProps[prop]();
      }
      return undefined;
    },
  });
};
