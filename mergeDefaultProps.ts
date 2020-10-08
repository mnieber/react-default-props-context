export const mergeDefaultProps = (props: any) => {
  if (!props.defaultProps) {
    console.error("No default props: ", props);
  }
  return new Proxy(props, {
    get: function (obj, prop) {
      if (prop in obj) {
        return obj[prop];
      }
      if (prop in props.defaultProps) {
        return props.defaultProps[prop]();
      }
      return undefined;
    },
  });
};
