import * as React from 'react';

export const DefaultPropsContext = React.createContext<{
  [key: string]: Function;
}>({});

export const useDefaultPropsContext = () => {
  return React.useContext(DefaultPropsContext);
};

export const NestedDefaultPropsProvider = (props: any) => {
  const defaultProps = useDefaultPropsContext();

  if (!Object.keys(props.value).length) {
    return props.children;
  }

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
