import * as React from 'react';
import {
  DefaultPropsContext,
  NestedDefaultPropsProvider,
  withDefaultPropsContext,
} from './NestedDefaultPropsProvider';

const _createProxy = <PropsT, DefaultPropsT>(
  props: PropsT & Partial<DefaultPropsT>,
  defaultProps: { [key: string]: Function }
) => {
  return new Proxy(props, {
    get: function (obj: any, prop: string) {
      if (prop === 'childrenWithOriginalDefaultProps') {
        const children = (props as any)['children'];
        return (
          <DefaultPropsContext.Provider value={defaultProps}>
            {children}
          </DefaultPropsContext.Provider>
        );
      }
      if (prop in obj) {
        return obj[prop];
      }
      if (prop in defaultProps) {
        return defaultProps[prop]();
      } else {
        return undefined;
      }
    },
  }) as PropsT & DefaultPropsT;
};

export function withDefaultProps<
  PropsT,
  DefaultPropsT,
  AsT = PropsT & Partial<DefaultPropsT>
>(f: React.FC<PropsT & DefaultPropsT>) {
  return ((p: PropsT) => {
    const defaultProps = withDefaultPropsContext();
    if (!defaultProps) {
      console.error('No default props: ', p);
    }

    const props = _createProxy<PropsT, DefaultPropsT>(p, defaultProps);
    let newDefaultProps: any = undefined;
    for (const key of Object.keys(p)) {
      if (defaultProps.hasOwnProperty(key)) {
        if (newDefaultProps === undefined) {
          newDefaultProps = {};
        }
        newDefaultProps[key] = () => (p as any)[key];
      }
    }

    return newDefaultProps ? (
      <NestedDefaultPropsProvider value={newDefaultProps}>
        {f(props)}
      </NestedDefaultPropsProvider>
    ) : (
      f(props)
    );
  }) as React.FC<AsT>;
}

export const childrenWithOriginalDefaultProps = (p: any) =>
  p.childrenWithOriginalDefaultProps;
