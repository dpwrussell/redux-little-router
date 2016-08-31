// @flow
import type { Location } from 'history';
import type { RouterContext } from './provider';

import React, { PropTypes } from 'react';

type Props = {
  forRoute: string,
  forRoutes: [string],
  hasComponent: string,
  withConditions: (location: Location) => bool,
  children: ReactPropTypes.node
};

const ComponentFragment = (
  props: Props,
  context: {
    router: RouterContext
  }
) => {
  const { forRoute, forRoutes, hasComponent, withConditions, children } = props;
  const { store } = context.router;
  const { matchRoute } = store;
  const { router: location } = store.getState();

  if (
    forRoute &&
    matchRoute(location.pathname).route !== forRoute
  ) {
    return null;
  }

  if (forRoutes) {
    const anyMatch = forRoutes.some(route =>
      matchRoute(location.pathname).route === route
    );

    if (!anyMatch) {
      return null;
    }
  }

  if (
    hasComponent &&
    matchRoute(location.pathname).result.every(r => r.name !== hasComponent)
  ) {
    return null;
  }

  if (withConditions && !withConditions(location)) {
    return null;
  }

  return <div>{children}</div>;
};

ComponentFragment.contextTypes = {
  router: PropTypes.object
};

export default ComponentFragment;
