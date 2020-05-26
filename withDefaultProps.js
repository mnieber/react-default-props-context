import * as React from "react";

// $FlowFixMe
export const DefaultPropsContext = React.createContext({});

export const withDefaultProps = WrappedComponent => props => {
  return (
    <DefaultPropsContext.Consumer>
      {defaultProps => {
        return <WrappedComponent {...props} defaultProps={defaultProps} />;
      }}
    </DefaultPropsContext.Consumer>
  );
};
