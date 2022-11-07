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

export const NestedDefaultPropsContext = (
  props: React.PropsWithChildren<{ value: ValueT }>
) => {
  const parentValue = useDefaultPropsContext();

  return (
    <DefaultPropsContext.Provider
      value={{
        defaultProps: {
          ...parentValue.defaultProps,
          ...props.value.defaultProps,
        },
        fixed: {
          ...(parentValue.fixed ?? {}),
          ...(props.value.fixed ?? {}),
        },
      }}
    >
      {props.children}
    </DefaultPropsContext.Provider>
  );
};
