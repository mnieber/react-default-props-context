# withDefaultProps

An alternative way to provide default properties to React components.
See also [this](https://mnieber.github.io/react/typescript/2020/05/23/using-default-properties-in-react.html) and
[this](https://mnieber.github.io/react/2020/05/26/inserting-facets-into-react-components.html) blog post.

The Synopsis below shows examples of providing and consuming default properties.
Below the Synopsis we present several snippets (short examples) and facts about those snippets.

## Synopsis

A `PropsContext` is a React context that offers a dictionary of getter functions.
Each getter function corresponds to a default property that is available through
the `withDefaultProps` higher order component.
Instead of using `DefaultPropsContext.Provider`, you should use the `DefaultPropsProvider`
component, which offers additional functionality (i.e. the `extend` attribute).

### Providing the default properties

```ts
import { DefaultPropsProvider } from 'react-default-props-context';

const MyFrame = () => {
  const defaultPropsContext = {
    defaultProps: {
      color: () => 'red',
    },
  };

  return (
    // Note that DefaultPropsProvider is a substitute for DefaultPropsContext.Provider
    <DefaultPropsProvider value={defaultPropsContext}>
      <div>
        <MyComponent name="example using red (the default color)" />
        <MyComponent name="example using green" color="green" />
      </div>
    </DefaultPropsProvider>
  );
};
```

### Consuming the default properties

```ts
import { withDefaultProps, stub } from 'react-default-props-context';

type PropsT = { name: string };

const DefaultProps = { color: stub as string };

const MyComponent = withDefaultProps(
  //
  (props: PropsT & typeof DefaultProps) => {
    // The props.color value either comes directly from the parent element
    // (as a property) or from a PropsContext.
    return <text color={props.color}>{`Hello ${props.name}`}</text>;
  },
  DefaultProps
);
```

## DocuFactation

The remainder of this documentation presents a series of snippets and facts about those snippets.

---

### 🟢 Snippet (./MyFrame.tsx)

```ts
import { DefaultPropsProvider } from 'react-default-props-context';

const MyFrame = () => {
  const defaultPropsContext = {
    defaultProps: {
      color: () => 'red',
    },
  };

  return (
    <DefaultPropsProvider value={defaultPropsContext}>
      <MyComponent name="example using red (the default color)" />
    </DefaultPropsProvider>
  );
};
```

---

### DefaultPropsProvider provides default properties

The `DefaultPropsProvider` provides every default property stored in `defaultProps` to its nested components (`MyComponent`).

---

### Default properties are stored as functions.

Rather than storing values directly in `defaultProps`, each default property is stored as a function that returns the default value. This function is called when the consuming component (`MyComponent`) accesses the default property. There are two reasons for this design. First, it provides lazy evaluation, which means that the default property value can be unknown when the PropsContext is created. Second, it prevents the providing component (`MyFrame`) from referencing the property value. This is important when using MobX (or any other framework that tracks variable access): if the default value changes then this will not trigger a re-render of `MyFrame`.

---

### 🟢 Snippet (./MyComponent.tsx)

```ts
import { withDefaultProps } from 'react-default-props-context';

type PropsT = { name: string };

const DefaultProps = { color: stub as string };

const MyComponent = withDefaultProps(
  //
  (props: PropsT & typeof DefaultProps) => {
    return <text color={props.color}>{`Hello ${props.name}`}</text>;
  },
  DefaultProps
);
```

---

### withDefaultProps gives access to the default properties

The `withDefaultProps` function is a higher order component that receives a properties object and "enriches" it with the default properties provided by the enclosing `DefaultPropsProvider`. It passes the enriched properties to it's enclosed component function. Informally, you can think of it as receiving the `props.color` value either from the parent component (that can set this property) or from the enclosing `PropsContext`.

---

### The default property types are declared using a plain object

To tell `withDefaultProps` which default properties are used in a component, you need to pass in a plain `DefaultProps` object where:

- the object keys contain the names of the default properties
- the object value types contain the types of the default properties.

Note that the object values themselves are unimportant, because the default property value will be provided by the enclosing `PropsContext`. The `withDefaultProps` function uses the default property names to assert (at run-time) that requested default property are provided. The default property types are used to produce a type error when overriding a default property using the wrong type.

---

### 🟢 Snippet (./MyFrame.tsx)

```ts
import { DefaultPropsProvider } from 'react-default-props-context';

const MyFrame = () => {
  const defaultPropsContext = {
    defaultProps: {
      color: () => 'red',
      shape: () => 'circle',
    },
  };
  const moreDefaultPropsContext = {
    defaultProps: {
      size: () => 123,
      shape: undefined
    }
  };

  return (
    <DefaultPropsProvider value={{
      defaultProps: defaultProps,
      fixed: { shape: true },
    }}>
      <DefaultPropsProvider extend value={{ defaultProps: moreDefaultProps }}>
        <MyComponent name="example using green" color="green">
          <MyComponent name="this nested component also uses green"/>
          <MyComponent name="this nested component uses blue" color="blue"/>
        <MyComponent/>
      </DefaultPropsProvider>
    </DefaultDefaultPropsProvider>
  );
};
```

---

### DefaultPropsProvider with extend=true extends the list of default properties

Because we use a `DefaultPropsProvider` with `extend=true` here, the `MyComponent` instance can access both the `color` and the `size` default property. If we dont set `extend` to true then `MyComponent` only has access to `size` (because it only takes default properties from the nearest enclosing `DefaultDefaultPropsProvider`).

---

### You can override a default property value

Here, we override the default `color` value by setting it to `green`. This works by wrapping the `MyComponent` instance in a extended `DefaultPropsProvider` that adds a new `color` default property with `green` as its value. So when `MyFrame` sets the `color` property of `MyComponent`, it has the side effect of overriding the default `color` property. This means that the new default value (`green`) is also provided to any child components of `MyComponent`.

---

### You can declare a default property to be fixed

In some case, it's good to allow components to use a default property, but not to override it. This can be achieved this by setting the `fixed` options object. In the example, we see how this is used to declare `shape` to be fixed.

---

### Default properties can be removed

Sometimes you want to remove a default property in a particular branch of the rendering tree. You can do this by setting the property to undefined in the `defaultProps` object. In the above example, the `shape` default property was removed.

---

### 🟢 Snippet (./MyFrame.tsx)

```ts
// file: dps.ts
import { stub } from 'react-default-props-context';

const dps = {
  color: { color: stub as string };
  size: { size: stub as int };
}
```

```ts
// file: MyComponent.tsx
import { withDefaultProps } from 'react-default-props-context';
import { dps } from 'dps';

type PropsT = { name: string };

const DefaultProps = {
  ...dps.color,
  ...dps.size,
};

const MyComponent = withDefaultProps((props: PropsT & typeof DefaultProps) => {
  const propsReceivedFromParent = getOriginalProps(props);
  const defaultPropsWithoutOverrides = getOriginalDefaultProps(props);

  return <text color={props.color}>{`Size is ${props.size}`}</text>;
}, DefaultProps);
```

---

### The default properties can be defined centrally

It makes sense to use a central location to define the names and types of the default properties that are used in the application.
This way, when using the default properties in your component, you are protected from misspelling the names, or using the wrong types.
In the above example, we see how `color` and `size` can be defined in a global `defaultProps.ts` file.

---

### The getOriginalProps returns the properties received from the parent

The `props` argument of `MyComponent` contains both normal properties and default properties. If you want to access only the properties received from the parent component then you can use the `getOriginalProps` function.

---

### The getOriginalDefaultProps returns the default properties without overrides

If the parent component of `MyComponent` sets the `color` property (e.g. `color="green"`) then this has the effect of overriding the `color` default property value . If you want to access the original default properties (without overrides from the parent component) then you can use the `getOriginalDefaultProps` function.
