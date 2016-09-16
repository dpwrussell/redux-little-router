import { LOCATION_CHANGED } from '../action-types';
import { getReqs } from './util';

// Middleware to trigger import of bundles require to instantitate the route
const codeSplitFactory = matchRoute => store => next => action => {

  if (
    action.type === LOCATION_CHANGED &&
    action.payload
  ) {
    const pathname = action.payload.pathname;
    const match = matchRoute(pathname);
    const { routeComponents } = match;

    // Get all the requirements for this route
    const reqs = getReqs(store.dispatch, store.getState, {
      ...action.payload,
      routeComponents
    });

    // If there is bundled code to be loaded, replay the original action once
    // it has been
    if (reqs.length > 0) {
      Promise.all(reqs).then(() =>
        store.dispatch({
          type: `ROUTER_${action.payload.action}`,
          payload: action.payload.route
        })
      );
      // Abort action
      return null;
    }
  }

  return next(action);
};

export default codeSplitFactory;
