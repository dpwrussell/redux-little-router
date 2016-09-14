import React, { PropTypes } from 'react';

// TODO Route Not Found

const ComponentFragment = (props, context) => {
  const { forRoute, forRoutes, hasComponent, withConditions, children } = props;
  const { store } = context.router;
  const { matchRoute } = store;
  const { router: location } = store.getState();

  const match = matchRoute(location.pathname);

  if (match) {

    if (
      forRoute &&
      match.route !== forRoute
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
      hasComponent &&
      match.routeComponents.every(r => r.name !== hasComponent)
    ) {
      return null;
    }

    if (withConditions && !withConditions(location)) {
      return null;
    }

    return <div>{ children }</div>;
  }

  return null;
};

ComponentFragment.contextTypes = {
  router: PropTypes.object
};

export default ComponentFragment;
