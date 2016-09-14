// For the current route, identify any requirements which must be loaded before
// it can be renered initially
export const getReqs = (dispatch, getState, route) => {

  return route.routeComponents.filter(
    // Filter out routeComponents that do not have requirements
    routeComponent => routeComponent.hasOwnProperty('req')

  ).map(routeComponent => {
    // Execute the requirement or requirements
    if (routeComponent.req instanceof Array) {
      return routeComponent.req.map(
        r => r(dispatch, getState, route)
      );
    }
    return [routeComponent.req(dispatch, getState, route)];

  }).reduce(
    // Flatten the reqs
    (a, b) => a.concat(b),
    []

  ).filter(
    // Remove any requirements which are `true` and are thus already
    // imported. Everything else should be a Promise
    r => r !== true
  );
};

export default {
  getReqs
};
