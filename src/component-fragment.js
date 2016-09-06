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
      match.result.every(r => r.name !== hasComponent)
    ) {
      return null;
    }

    if (withConditions && !withConditions(location)) {
      return null;
    }
  } else {
    console.log('No match for', location.pathname);
  }

  return <div>{children}</div>;
};

ComponentFragment.contextTypes = {
  router: PropTypes.object
};

export default ComponentFragment;
