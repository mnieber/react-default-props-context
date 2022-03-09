# withDefaultProps

An alternative way to provide default properties to React components.
See also [this](https://mnieber.github.io/react/typescript/2020/05/23/using-default-properties-in-react.html) and
[this](https://mnieber.github.io/react/2020/05/26/inserting-facets-into-react-components.html) blog post.

## Synopsis

A `DefaultPropsContext` is a React context that offers a dictionary of getter functions.
Each getter function corresponds to a default property that is available through
the `withDefaultProps` higher order component.

### Providing the default properties

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

### Consuming the default properties
```
import { withDefaultProps } from "react-default-props-context";

type PropsT = {
  name: string,
};

type DefaultPropsT = {
  color: string,
}

const MyComponent = withDefaultProps<PropsT, DefaultPropsT>(
  (props: PropsT & DefaultPropsT) => {
    // The color value is either received directly from the parent element (as a property)
    // or comes from a DefaultPropsContext.
    return <text color={props.color}>Hello</text>;
  }
);
```

## NestedDefaultPropsProvider

This React component is similar to `DefaultPropsContext.Provider` but supports nesting.
When nested instances of `NestedDefaultPropsProvider` are used, their default properties are automatically merged into a single big list.

## What happens when a default property is overwritten?

In the example above we use `color="green"` to override the default value of `color`. This has the effect
of (automatically) inserting a `NestedDefaultPropsProvider` that provides the new value. This means that also children of the receiving component see the overridden value!

## The getOriginalProps and getOriginalDefaultProps functions

Sometimes it's useful to know where each property in the merged properties object came from. You can use `getOriginalProps(props)` to access the properties that were passed in from the parent, and `getOriginalDefaultProps(props)` to access the default properties (not overwritten by the parent) that were received from the `DefaultPropsContext`.

## CtrProvider

This is a helper component that connects a data container to a `NestedDefaultPropsProvider`. It does the following things:

1. instantiate the container
2. keep the container up-to-date when some input data changes
3. provide the contents of the container as default properties using a `NestedDefaultPropsProvider`
4. destroy the container when the `CtrProvider` is unmounted.

The `CtrProvider` component has the following properties:

- createCtr - the function that creates a new container
- updateCtr - the function that is called after mounting the `CtrProvider` to keep the container up-to-date.
- getDefaultProps - the function that returns a dictionary of getter functions which expose the contents of the container as default properties.
- destroyCtr - the function that is called when `CtrProvider` unmounts

It's recommended to use `addCleanUpFunctionToCtr` to register clean up functions (in `updateCtr`) and set `destroyCtr={(ctr) => cleanUpCtr(ctr)}` to execute these cleanup functions when `CtrProvider` unmounts

```
import {
  addCleanUpFunctionToCtr,
  cleanUpCtr,
  CtrProvider
} from 'react-default-props-context';

export const TodoListCtrProvider = ({ children }) => {

  const createCtr = () => {
    const ctr = new TodoListCtr();

    // Do any actions that need to happen before using
    // the container.
    ctr.filtering.setIsFilterActive(true);

    return ctr;
  };

  // keep ctr.inputs.userProfile up-to-date
  const updateCtr = (ctr: TodoListContainer) => {
    const f = reaction(
      () => ({
        userProfile: props.userProfile,
      }),
      ({ userProfile }) => {
        ctr.inputs.setUserProfile(userProfile);
      },
      {
        fireImmediately: true,
      }
    );
    addCleanUpFunctionToCtr(ctr, f);
  }

  const getDefaultProps = ctr => {
    return {
      todoListStorage: () => ctr.storage,
      todoListFiltering: () => ctr.filtering,
      todoListCtr: () => ctr,
    };
  };

  return (
    <CtrProvider
      createCtr={createCtr}
      updateCtr={updateCtr}
      destroyCtr={(ctr) => cleanUpCtr(ctr)}
      getDefaultProps={getDefaultProps}
      children={children}
    />
  );
};
```
