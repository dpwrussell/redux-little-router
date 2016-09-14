import { LOCATION_CHANGED } from '../action-types';
import { getReqs } from './util';

// Middleware to trigger import of bundles require to instantitate the route
const codeSplit = store => next => action => {

  if (
    action.type === LOCATION_CHANGED &&
    action.payload &&
    action.payload.routeComponents
  ) {

    // Get all the requirements for this route
    const reqs = getReqs(store.dispatch, store.getState, action.payload);

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

export default codeSplit;
