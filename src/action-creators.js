import { LOCATION_CHANGED, LOCATION_INIT } from './action-types';

export const locationDidChange = ({ location, matchRoute }) => {
  // Extract the pathname so that we don't match against the basename.
  // This avoids requiring basename-hardcoded routes.
  const { pathname } = location;

  const payload = {
    ...location,
    ...matchRoute(pathname)
  };
  delete payload.routeComponents;

  return {
    type: LOCATION_CHANGED,
    payload
  };
};

export const locationInit = ({ location, matchRoute }) => {
  // Extract the pathname so that we don't match against the basename.
  // This avoids requiring basename-hardcoded routes.
  const { pathname } = location;

  const payload = {
    ...location,
    ...matchRoute(pathname)
  };
  delete payload.routeComponents;

  console.log('INIT', payload);

  return {
    type: LOCATION_CHANGED,
    payload
  };
};
