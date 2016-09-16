import { LOCATION_CHANGED } from '../action-types';
import { getNeeds } from './util';

// Middleware to trigger async actions based on the route that is currently being loaded.
// export const routeFetch = store => next => action => {
//
//   if (
//     action.type === LOCATION_CHANGED &&
//     action.payload &&
//     action.payload.routeComponents
//   ) {
//
//     // Get all the needs for this route
//     getNeeds(store.dispatch, store.getState, action.payload);
//   }
//
//   return next(action);
// };

export const routeFetchFactory = matchRoute => store => next => action => {

  if (
    action.type === LOCATION_CHANGED &&
    action.payload
  ) {

    const pathname = action.payload.pathname;
    const match = matchRoute(pathname);
    const { routeComponents } = match;

    // Get all the needs for this route
    getNeeds(store.dispatch, store.getState, {
      ...action.payload,
      routeComponents
    });
  }

  return next(action);
};

export default routeFetchFactory;
