import * as React from "react";
export { withDefaultProps } from "mergeDefaultProps/withDefaultProps";
export { NestedDefaultPropsProvider } from "mergeDefaultProps/NestedDefaultPropsProvider";

export const mergeDefaultProps = (props) => {
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
