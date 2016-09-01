import { LOCATION_CHANGED } from './action-types';

export const locationDidChange = ({
  location,
  matchRoute
}) => {
  // Extract the pathname so that we don't match against the basename.
  // This avoids requiring basename-hardcoded routes.
  const { pathname } = location;

  return {
    type: LOCATION_CHANGED,
    payload: {
      ...location,
      ...matchRoute(pathname)
    }
  };
};
