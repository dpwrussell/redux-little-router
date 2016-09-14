import React, { PropTypes } from 'react';

import { PUSH, REPLACE } from './action-types';

const LEFT_MOUSE_BUTTON = 0;

const normalizeHref = location => `${location.basename || ''}${location.pathname}`;

const normalizeLocation = href => {
  if (typeof href === 'string') {
    const pathnameAndQuery = href.split('?');
    const pathname = pathnameAndQuery[0]; // eslint-disable-line no-magic-numbers
    const query = pathnameAndQuery[1]; // eslint-disable-line no-magic-numbers
    return query ? { pathname, search: `?${query}` } : { pathname };
  }
  return href;
};

const resolveQueryForLocation = ({ linkLocation, persistQuery, currentLocation }) => {
  const currentQuery = currentLocation
                       && currentLocation.query;

  // Only use the query from state if it exists
  // and the href doesn't provide its own query
  if (
    persistQuery
    && currentQuery
    && !linkLocation.search
    && !linkLocation.query
  ) {
    return {
      pathname: linkLocation.pathname,
      query: currentQuery
    };
  }

  return linkLocation;
};

const isNotLeftClick = e => e.button && e.button !== LEFT_MOUSE_BUTTON;
const hasModifier = e => Boolean(e.shiftKey || e.altKey || e.metaKey || e.ctrlKey);

const onClick = ({e, target, location, replaceState, router}) => {
  if (hasModifier(e) || isNotLeftClick(e) || target) {
    return;
  }

  e.preventDefault();

  if (router) {
    router.store.dispatch({
      type: replaceState ? REPLACE : PUSH,
      payload: location
    });
  }
};

export const Link = (
  props,
  context
) => {
  const { href, target, persistQuery, replaceState, children, ...rest } = props;
  const { router } = context;

  const locationDescriptor = resolveQueryForLocation({
    linkLocation: normalizeLocation(href),
    currentLocation: router.store.getState().router,
    persistQuery
  });

  const location = router.store.history.createLocation(locationDescriptor);

  return (
    <a
      href={ normalizeHref(location) }
      onClick={ e => onClick({
        e,
        target,
        location,
        replaceState,
        router
      }) }
      { ...rest }
    >
      { children }
    </a>
  );
};

Link.contextTypes = {
  router: PropTypes.object
};

export class PersistentQueryLink extends React.Component {
  render() {
    const { children, ...rest } = this.props;
    return <Link {...rest} persistQuery>{children}</Link>;
  }
}

PersistentQueryLink.propTypes = {
  children: PropTypes.node
};

PersistentQueryLink.contextTypes = {
  router: PropTypes.object
};
