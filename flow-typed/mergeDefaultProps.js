declare module "mergeDefaultProps" {
  declare export function mergeDefaultProps<T>(props: { defaultProps: any }): T;
  declare export function NestedDefaultPropsProvider(props: {
    children: any,
    value: any,
    defaultProps?: any,
  }): any;
  declare export function withDefaultProps(WrappedComponent: any): any;
}
