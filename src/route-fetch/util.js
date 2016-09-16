// For the current route, identify any needs which must be fetched
export const getNeeds = (dispatch, getState, route) => {

  return route.routeComponents.filter(
    // Filter out routeComponents that do not have requirements
    routeComponent => routeComponent.hasOwnProperty('needs')

  ).map(routeComponent => {
    // Execute the requirement or requirements
    if (routeComponent.needs instanceof Array) {
      return routeComponent.needs.map(
        n => n(dispatch, getState, route)
      );
    }
    return [routeComponent.needs(dispatch, getState, route)];

  }).reduce(
    // Flatten the reqs
    (a, b) => a.concat(b),
    []

  );
};

export default {
  getNeeds
};
