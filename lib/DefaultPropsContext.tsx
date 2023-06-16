import * as React from 'react';

export const stub = null as unknown;

type ObjT = { [key: string]: any };

export type ValueT = {
  defaultProps: {
    [key: string]: Function | undefined;
  };
  fixed?: ObjT;
};

export const DefaultPropsContext = React.createContext<ValueT>({
  defaultProps: {},
});

export const useDefaultPropsContext = () => {
  return React.useContext(DefaultPropsContext);
};

export const DefaultPropsProvider = (props: React.PropsWithChildren<{ value: ValueT, extend?: boolean }>) => {
  const parentValue = useDefaultPropsContext();

  return (
    <DefaultPropsContext.Provider
      value={{
        defaultProps: props.extend ? {
          ...parentValue.defaultProps,
          ...props.value.defaultProps,
        } : props.value.defaultProps,
        fixed: props.extend ? {
          ...(parentValue.fixed ?? {}),
          ...(props.value.fixed ?? {}),
        } : props.value.fixed,
      }}
    >
      {props.children}
    </DefaultPropsContext.Provider>
  );
};
