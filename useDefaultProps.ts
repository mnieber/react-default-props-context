import * as React from "react";

import { useDefaultPropsContext } from "./NestedDefaultPropsProvider";

export const useDefaultProps = <PropsT, DefaultPropsT>(
  props: PropsT & Partial<DefaultPropsT>
) => {
  const defaultProps = useDefaultPropsContext();

  if (!defaultProps) {
    console.error("No default props: ", props);
  }

  return new Proxy(props, {
    get: function (obj: any, prop: string) {
      if (prop in obj) {
        return obj[prop];
      }
      if (prop in defaultProps) {
        return defaultProps[prop]();
      } else {
        throw Error(`No prop: ${prop}`);
      }
    },
  }) as PropsT & DefaultPropsT;
};

export type FC<PropsT, DefaultPropsT> = React.FC<
  PropsT & Partial<DefaultPropsT>
>;
