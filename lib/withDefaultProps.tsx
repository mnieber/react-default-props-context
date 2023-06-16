import * as React from 'react';
import {
  DefaultPropsProvider,
  useDefaultPropsContext,
} from './DefaultPropsContext';

const originalDefaultProps = Symbol();
const originalProps = Symbol();

const _createProxy = (
  props: any,
  defaultProps: { [key: string]: Function | undefined }
) => {
  return new Proxy(props, {
    get: function (obj: any, prop: any) {
      if (prop === originalDefaultProps) {
        return defaultProps;
      } else if (prop === originalProps) {
        return props;
      }
      if (prop in obj) {
        return obj[prop];
      } else if (prop in defaultProps) {
        return (defaultProps[prop] as Function)();
      } else {
        return undefined;
      }
    },
  });
};

type Without<T, K> = Pick<T, Exclude<keyof T, keyof K>>;
type ObjT = { [key: string]: any };

export function withDefaultProps<AllPropsT, DefaultPropsT extends ObjT>(
  f: React.FC<AllPropsT>,
  defaultProps: DefaultPropsT
) {
  return ((p: AllPropsT) => {
    const parentDefaultProps = useDefaultPropsContext();
    const allDefaultProps = parentDefaultProps.defaultProps;

    if (!allDefaultProps) {
      console.error('No default props: ', p);
    }

    if (process.env.NODE_ENV !== 'production') {
      for (const key of Object.keys(defaultProps)) {
        const isProvidedDefaultProp = allDefaultProps.hasOwnProperty(key);

        if (!isProvidedDefaultProp) {
          console.error(
            `Error: prop ${key} is requested as a default prop but not provided ` +
              `by a DefaultPropsContext.`
          );
        } else if (allDefaultProps[key] === undefined) {
          console.error(
            `Error: prop ${key} is requested as a default prop but not provided ` +
              `by a DefaultPropsContext. It appears it was removed from the ` +
              `default props object.`
          );
        }
      }

      for (const key of Object.keys(p as any)) {
        const isRequestedDefaultProp = defaultProps.hasOwnProperty(key);
        const isProvidedDefaultProp = allDefaultProps.hasOwnProperty(key);

        if (!isRequestedDefaultProp && isProvidedDefaultProp) {
          console.error(
            `Error: you cannot use a property ${key} that ` +
              `is also provided by a DefaultPropsContext. ` +
              `Did you forget to add it to the default props?`
          );
        }

        if (
          isRequestedDefaultProp &&
          isProvidedDefaultProp &&
          parentDefaultProps.fixed &&
          parentDefaultProps.fixed[key]
        ) {
          console.error(`Error: trying to override fixed default prop ${key}.`);
        }
      }
    }

    let newDefaultProps: any = undefined;
    for (const key of Object.keys(p as any)) {
      const isRequestedDefaultProp = defaultProps.hasOwnProperty(key);
      const isProvidedDefaultProp = allDefaultProps.hasOwnProperty(key);

      if (isRequestedDefaultProp && isProvidedDefaultProp) {
        if (newDefaultProps === undefined) {
          newDefaultProps = {};
        }
        newDefaultProps[key] = () => (p as any)[key];
      }
    }

    const props = _createProxy(p, allDefaultProps);
    return newDefaultProps ? (
      <DefaultPropsProvider
        extend
        value={{
          defaultProps: newDefaultProps as any,
        }}
      >
        {f(props)}
      </DefaultPropsProvider>
    ) : (
      f(props)
    );
  }) as React.FC<Without<AllPropsT, DefaultPropsT> & Partial<DefaultPropsT>>;
}

export const getOriginalDefaultProps = (p: any) => p[originalDefaultProps];
export const getOriginalProps = (p: any) => p[originalProps];
