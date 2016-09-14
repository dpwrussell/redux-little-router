import React, { PropTypes } from 'react';

const ComponentFragment = (props, context) => {
  const { forRoute, forRoutes, hasComponent, withConditions, children } = props;
  const { store } = context.router;
  const { matchRoute } = store;
  const { router: location } = store.getState();

  const match = matchRoute(location.pathname);

  if (match) {
    if (
      forRoute
      && match.route !== forRoute
    ) {
      return null;
    }

    if (forRoutes) {
      const anyMatch = forRoutes.some(route =>
        match.route === route
      );

      if (!anyMatch) {
        return null;
      }
    }

    if (
      hasComponent
      && match.routeComponents.every(r => r.name !== hasComponent)
    ) {
      return null;
    }

    if (
      withConditions
      && !withConditions(location)
    ) {
      return null;
    }
  } else {
    console.log('No match for', location.pathname);
  }

  // Find the component which matched (for component matches this is the
  // relevant component. For other types, the last routeComponent is used.)
  if (
    match.routeComponents.length > 0
  ) {
    const matchingComponent = hasComponent
                            ? match.routeComponents.find(r => r.name === hasComponent)
                            : match.routeComponents[match.routeComponents.length-1];

    if (matchingComponent.hasOwnProperty('component')) {
      const componentProps = matchingComponent.hasOwnProperty('componentProps')
                           ? matchingComponent.componentProps
                           : {};
      return React.createElement(
        matchingComponent.component,
        componentProps,
        children
      );
    }
  }

  return null;

};

ComponentFragment.contextTypes = {
  router: PropTypes.object
};

export default ComponentFragment;
