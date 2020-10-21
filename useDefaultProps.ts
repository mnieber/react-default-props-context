import * as React from "react";

import { useDefaultPropsContext } from "./NestedDefaultPropsProvider";

const _mergeDefaultProps = (props: any) => {
  const defaultProps = useDefaultPropsContext();

  if (!defaultProps) {
    console.error("No default props: ", props);
  }

  return new Proxy(props, {
    get: function (obj, prop) {
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

export const useDefaultProps = <PropsT, DefaultPropsT>(
  props: React.PropsWithChildren<PropsT & Partial<DefaultPropsT>>
) =>
  _mergeDefaultProps(props) as React.PropsWithChildren<PropsT & DefaultPropsT>;

export type FC<PropsT, DefaultPropsT> = React.FC<
  PropsT & Partial<DefaultPropsT>
>;
