export const makeComponentRoute = (details, ...children) => {
  return Object.assign({}, details, children ? { children } : {});
};
