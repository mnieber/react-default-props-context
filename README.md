# mergeDefaultProps

An alternative way to provide default properties to React components.

## Synopsis

```
type PropsT = {
  name: string,
  defaultProps: any,
};

type DefaultPropsT = {
  color: string,
}

const MyComponent(p: PropsT) {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);

  // The color value comes either from p.color or p.defaultProps.color
  const myText = <text color={props.color}>Hello</text>;

  // Use prop-drilling to pass props.defaultProps down to MyChildComponent.
  // MyChildComponent may refer to default properties that exist
  // in props.defaultProps but are not mentioned in DefaultPropsT.
  const myChildComponent = <MyChildComponent defaultProps={props.defaultProps}/>;

  return <div>{myText}{myChildComponent}</div>;
}

const SmartComponent = ({ children }) => {
  const foo = getFoo();
  const defaultProps = {
      color: () => "red",
      bar: () => foo.bar,
      // other properties...
  }

  return (
    <DefaultPropsContext.Provider value={defaultProps}>
      {children}
    </DefaultPropsContext.Provider>
  );
}

const ComponentWithNestedProviders = () => {
  return (
    <NestedDefaultPropsProvider value={{foo: "bar"}}>
      <NestedDefaultPropsProvider value={{foo: "baz"}}>
        {children}
      </NestedDefaultPropsProvider>
    </NestedDefaultPropsProvider>
  );
}
```
