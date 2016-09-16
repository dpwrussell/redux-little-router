import { LOCATION_CHANGED } from '../action-types';
import { getNeeds } from './util';

// Middleware to trigger async actions based on the route that is currently being loaded.
export const routeFetch = store => next => action => {

  if (
    action.type === LOCATION_CHANGED &&
    action.payload &&
    action.payload.routeComponents
  ) {

    // Get all the needs for this route
    getNeeds(store.dispatch, store.getState, action.payload);
  }

  return next(action);
};

export const routeFetchFactory = (history, matchRoute) => store => next => action => {

  if (
    action.type === LOCATION_CHANGED &&
    action.payload &&
    action.payload.routeComponents
  ) {

    const location = history.getCurrentLocation();
    const { pathname } = location;
    const match = matchRoute(pathname);
    console.log('MATCH');
    console.log(match);

    // Get all the needs for this route
    getNeeds(store.dispatch, store.getState, action.payload);
  }

  return next(action);
};

export default routeFetchFactory;
