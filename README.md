# useDefaultProps

An alternative way to provide default properties to React components.
See also [this](https://mnieber.github.io/react/typescript/2020/05/23/using-default-properties-in-react.html) and
[this](https://mnieber.github.io/react/2020/05/26/inserting-facets-into-react-components.html) blog post.

## Synopsis

```
import { useDefaultProps, FC } from "react-default-props-context";

type PropsT = {
  name: string,
};

type DefaultPropsT = {
  color: string,
}

const MyComponent: FC<PropsT, DefaultPropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  // The color value comes either from p.color or from a DefaultPropsContext.
  return <text color={props.color}>Hello</text>;
}
```

## Reference documentation

### DefaultPropsContext

A `DefaultPropsContext` is a React context that offers a dictionary of getter functions.
Each getter function corresponds to a default property that is available through
the `useDefaultProps` hook.

```
import { DefaultPropsContext } from "react-default-props-context";

const MyFrame = observer(() => {
  const foo = getFoo();

  const defaultProps = {
    color: () => "red",
    bar: () => foo.bar,
  };

  return (
    <DefaultPropsContext.Provider value={defaultProps}>
      <MyComponent name="example using the default color"/>
      <MyComponent name="example overriding default color" color="green"/>
    </DefaultPropsContext.Provider>
  )
})
```

### FC

The `FC` type (short for Functional Component) is similar to `React.FC`. In comparison to `React.FC` it
receives a "default properties" type argument. It represents a react component with properties
that may be either set directly or may come from the default properties context.

### NestedDefaultPropsProvider

This is a React component that is similar to `DefaultPropsContext.Provider` but supports nesting.
When nested instances of `NestedDefaultPropsProvider` are used, their default properties are automatically merged.

### useDefaultProps

This is a hook that returns a new properties object that gives access to the union of the component's properties
and the default properties (that were provided via a DefaultPropsContext).

### CtrProvider

This is a helper component that does three things:

1. instantiate a container
2. keep the container up-to-date when some input data changes
3. provide the contents of the container as default properties using a `NestedDefaultPropsProvider`

The `CtrProvider` component has the following properties:

- createCtr - the function that creates a new container
- updateCtr - the function that is called after mounting the `CtrProvider` to keep the container up-to-date.
  Note that if this function installs a MobX reaction (or some other mechanism that keeps the container
  up-to-date) then it should return a dispose function that removes this mechanism.
- getDefaultProps - the function that returns a dictionary of getter functions which expose the contents of the
  container as default properties.
- ctrKey - an optional string that ensures that the container is kept alive in case the `CtrProvider` is destroyed.
  Note that if a new `CtrProvider` instance is mounted then the `updateCtr` function will be called (but not
  `createCtr`)

```
export const TodoListCtrProvider = ({ children }) => {
  const createCtr = () => {
    const ctr = new TodoListCtr();

    // Do any actions that need to happen before using
    // the container.
    ctr.filtering.setIsFilterActive(true);

    return ctr;
  };

  // keep ctr.inputs.userProfile up-to-date
  const updateCtr = (ctr: TodoListContainer) =>
    reaction(
      () => ({
        userProfile: props.userProfile,
      }),
      ({ userProfile }) => {
        ctr.inputs.setUserProfile(userProfile);
      }
    );

  const getDefaultProps = ctr => {
    return {
      todoListStorage: () => ctr.storage,
      todoListFiltering: () => ctr.filtering,
      todoListCtr: () => ctr,
    };
  };

  return (
    <CtrProvider
      ctrKey={"my todo list container"}
      createCtr={createCtr}
      updateCtr={updateCtr}
      getDefaultProps={getDefaultProps}
      children={children}
    />
  );
};
```
