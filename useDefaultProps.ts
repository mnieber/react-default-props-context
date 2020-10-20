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

interface MixInDefaultProps {
  defaultProps?: any;
  children?: any;
}

export const useDefaultProps = <PropsT, DefaultPropsT>(
  props: PropsT & MixInDefaultProps & Partial<DefaultPropsT>
) => _mergeDefaultProps(props) as PropsT & MixInDefaultProps & DefaultPropsT;

export type FC<PropsT, DefaultPropsT> = React.FC<
  PropsT & MixInDefaultProps & Partial<DefaultPropsT>
>;
