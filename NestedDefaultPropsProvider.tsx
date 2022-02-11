import * as React from 'react';

export const DefaultPropsContext = React.createContext<{
  [key: string]: Function;
}>({});

export const withDefaultPropsContext = () => {
  return React.useContext(DefaultPropsContext);
};

export const NestedDefaultPropsProvider = (props: any) => {
  const defaultProps = withDefaultPropsContext();

  const value = {
    ...(defaultProps || {}),
    ...props.value,
  };

  return (
    <DefaultPropsContext.Provider value={value}>
      {props.children}
    </DefaultPropsContext.Provider>
  );
};
