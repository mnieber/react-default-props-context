# withDefaultProps

An alternative way to provide default properties to React components.
See also [this](https://mnieber.github.io/react/typescript/2020/05/23/using-default-properties-in-react.html) and
[this](https://mnieber.github.io/react/2020/05/26/inserting-facets-into-react-components.html) blog post.

The Synopsis below shows examples of providing and consuming default properties.
Below the Synopsis we present several snippets (short examples) and facts about those snippets.

## Synopsis

A `DefaultPropsContext` is a React context that offers a dictionary of getter functions.
Each getter function corresponds to a default property that is available through
the `withDefaultProps` higher order component.

### Providing the default properties

```ts
import { DefaultPropsContext } from 'react-default-props-context';

const MyFrame = () => {
  const defaultProps = { color: () => 'red' };

  return (
    <DefaultPropsContext.Provider value={defaultProps}>
      <div>
        <MyComponent name="example using red (the default color)" />
        <MyComponent name="example using green" color="green" />
      </div>
    </DefaultPropsContext.Provider>
  );
};
```

### Consuming the default properties

```ts
import { withDefaultProps } from 'react-default-props-context';

type PropsT = { name: string };
type DefaultPropsT = { color: string };

const MyComponent = withDefaultProps<PropsT, DefaultPropsT>(
  (props: PropsT & DefaultPropsT) => {
    // The props.color value either comes directly from the parent element
    // (as a property) or from a DefaultPropsContext.
    return <text color={props.color}>{`Hello ${props.name}`}</text>;
  }
);
```

## DocuFactation

The remainder of this documentation uses the DocuFactation format: it presents a series of
snippets and facts about those snippets.

---

### 🟢 Snippet (./MyFrame.tsx)

```ts
import { DefaultPropsContext } from 'react-default-props-context';

const MyFrame = () => {
  const defaultProps = { color: () => 'red' };

  return (
    <DefaultPropsContext.Provider value={defaultProps}>
      <MyComponent name="example using red (the default color)" />
    </DefaultPropsContext.Provider>
  );
};
```

---

### DefaultPropsContext.Provider provides default properties

The `DefaultPropsContext.Provider` provides every default property stored in `defaultProps` to its nested components (`MyComponent`).

---

### Default properties are stored as functions.

Rather than storing values directly in `defaultProps`, each default property is stored as a function that returns the default value. This function is called when the consuming component (`MyComponent`) accesses the default property. There are two reasons for this design:

- the function can return a transformed value. This adds some useful flexibility.
- it prevents the providing component (`MyFrame`) from referencing the property value. This is important when using MobX (or any other framework that tracks variable access): if the default value changes then this will not trigger a re-render of `MyFrame`.

---

### 🟢 Snippet (./MyComponent.tsx)

```ts
import { withDefaultProps } from 'react-default-props-context';

type PropsT = { name: string };
type DefaultPropsT = { color: string };

const MyComponent = withDefaultProps<PropsT, DefaultPropsT>(
  (props: PropsT & DefaultPropsT) => {
    return <text color={props.color}>{`Hello ${props.name}`}</text>;
  }
);
```

---

### withDefaultProps gives access to the default properties

The `withDefaultProps` function is a higher order component that receives a properties object and "enriches" it with the default properties provided by the enclosing `DefaultPropsContext.Provider`. It passes the enriched properties to it's enclosed component function. Informally, you can think of it as receiving the `props.color` value either from the parent component (that can set this property) or from the enclosing `DefaultPropsContext`.

---

### DefaultPropsT declares the default properties

By convention, the `PropsT` type contains the normal properties of `MyFrame` and `DefaultPropsT` contains the default properties. Typescript will complain if you get or set a property that is not in `PropsT` or in `DefaultPropsT`.

---

### 🟢 Snippet (./MyFrame.tsx)

```ts
import {
  DefaultPropsContext,
  NestedDefaultPropsContext,
} from 'react-default-props-context';

const MyFrame = () => {
  const defaultProps = { color: () => 'red' };
  const moreDefaultProps = { size: () => 'large' };

  return (
    <DefaultPropsContext.Provider value={defaultProps}>
      <NestedDefaultPropsContext value={moreDefaultProps}>
        <MyComponent name="example using green" color="green" />
      </NestedDefaultPropsContext>
    </DefaultPropsContext.Provider>
  );
};
```

---

### NestedDefaultPropsContext extends the list of default properties

Because we use a `NestedDefaultPropsContext` here, the `MyComponent` instance can access both the `color` and the `size` default property. If we replace the `NestedDefaultPropsContext` with another `DefaultPropsContext.Provider` then `MyComponent` only has access to `size` (because it only takes default properties from the nearest enclosing `DefaultPropsContext.Provider`).

---

### 🟢 Snippet (./MyFrame.tsx)

```ts
import { DefaultPropsContext } from 'react-default-props-context';

const MyFrame = () => {
  const defaultProps = { color: () => 'red' };

  return (
    <DefaultPropsContext.Provider value={defaultProps}>
      <MyComponent name="example using green" color="green">
        <MyComponent name="this nested component also uses green"/>
        <MyComponent name="this nested component uses blue" color="blue"/>
      <MyComponent/>
    </DefaultPropsContext.Provider>
  );
};
```

---

### You can override a default property value

Here, we override the default `color` value by setting it to `green`. This works by wrapping the `MyComponent` instance in a `NestedDefaultPropsProvider` that adds a new `color` default property with `green` as its value. So when `MyFrame` sets the `color` property of `MyComponent`, it has the side effect of overriding the default `color` property. This means that the new default value (`green`) is also provided to any child components of `MyComponent`.

---

### Be careful when sharing names between normal and default properties

If `MyComponent` has a normal `color` property (in `PropsT` instead of in `DefaultPropsT`) then setting `color="green"` still has the effect of overriding the existing value of the `color` default property. It's better to avoid this situation and add `color` to `DefaultPropsT`.

---

### 🟢 Snippet (./MyFrame.tsx)

```ts
import {
  withDefaultProps,
  getOriginalProps,
  getOriginalDefaultProps,
} from 'react-default-props-context';

type PropsT = { name: string };
type DefaultPropsT = { color: string };

const MyComponent = withDefaultProps<PropsT, DefaultPropsT>(
  (props: PropsT & DefaultPropsT) => {
    const propsReceivedFromParent = getOriginalProps(props);
    const defaultPropsWithoutOverrides = getOriginalDefaultProps(props);

    return <text color={props.color}>{`Hello ${props.name}`}</text>;
  }
);
```

---

### The getOriginalProps returns the properties received from the parent

The `props` argument of `MyComponent` contains both normal properties and default properties. If you want to access only the properties received from the parent component then you can use the `getOriginalProps` function.

---

### The getOriginalDefaultProps returns the default properties without overrides

If the parent component of `MyComponent` sets the `color` property (e.g. `color="green"`) then this has the effect of overriding the `color` default property value . If you want to access the original default properties (without overrides from the parent component) then you can use the `getOriginalDefaultProps` function.

---

### 🟢 Snippet (./TodoListCtrProvider.tsx)

```ts
import {
  addCleanUpFunctionToCtr,
  cleanUpCtr,
  CtrProvider,
} from 'react-default-props-context';
import { reaction } from 'mobx';

export const TodoListCtrProvider = ({ children }) => {
  const createCtr = () => {
    const ctr = new TodoListCtr();
    ctr.filtering.setIsFilterActive(true);
    return ctr;
  };

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
  };

  const getDefaultProps = (ctr) => {
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
    >
      {children}
    <CtrProvider/>
  );
};
```

---

### CtrProvider connects a data container to a NestedDefaultPropsProvider

`CtrProvider` is a helper component that connects a data container to a `NestedDefaultPropsProvider`. It does the following things:

1. instantiate the container
2. keep the container up-to-date when some input data changes
3. provide the contents of the container as default properties using a `NestedDefaultPropsProvider`
4. destroy the container when the `CtrProvider` is unmounted.

---

### CtrProvider has createCtr, updateCtr, getDefaultProps and destroyCtr

The `CtrProvider` component has the following properties:

- createCtr - the function that creates a new container (of type `TodoListContainer`)
- updateCtr - the function that is called after mounting the `CtrProvider` to keep the container up-to-date. Here, we call `ctr.inputs.setUserProfile`.
- getDefaultProps - the function that returns a dictionary of getter functions which expose the contents of the container as default properties.
- destroyCtr - the function that is called when `CtrProvider` unmounts

---

### addCleanUpFunctionToCtr registers a clean up function

It's often the case that resource are allocated when creating a container, which must be deallocated when the container is destroyed in the `destroyCtr` function. For this purpose you can call `addCleanUpFunctionToCtr(f, ctr)` to register a clean up function `f` in container `ctr`. Then, you can use `destroyCtr={(ctr) => cleanUpCtr(ctr)}` to execute these cleanup functions when the `CtrProvider` unmounts.
