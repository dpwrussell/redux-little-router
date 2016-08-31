// @flow
export const makeComponentRoute = (details: Object, ...children: Array<Object>) => {
  return Object.assign({}, details, children ? { children } : {});
};
