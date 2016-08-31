// @flow
export const makeRoute = (details: Object, ...children: Array<Object>) => {
  return Object.assign({}, details, children ? { children } : {});
};
