import * as React from "react";

const _mergeDefaultProps = (props: any) => {
  if (!props.defaultProps) {
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

export const mergeDefaultProps = <PropsT, DefaultPropsT>(
  props: PropsT & MixInDefaultProps & Partial<DefaultPropsT>
) => _mergeDefaultProps(props) as PropsT & MixInDefaultProps & DefaultPropsT;

export type FC<PropsT, DefaultPropsT> = React.FC<
  PropsT & MixInDefaultProps & Partial<DefaultPropsT>
>;
