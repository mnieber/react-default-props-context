import * as React from 'react';

export const DefaultPropsContext = React.createContext({});

export const withDefaultProps = (WrappedComponent: React.FC) => (
  props: any
) => {
  return (
    <DefaultPropsContext.Consumer>
      {(defaultProps: any) => {
        return <WrappedComponent {...props} defaultProps={defaultProps} />;
      }}
    </DefaultPropsContext.Consumer>
  );
};
