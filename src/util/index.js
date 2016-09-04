import createBrowserHistory from 'history/lib/createBrowserHistory';
import useBasename from 'history/lib/useBasename';
import useQueries from 'history/lib/useQueries';

import storeEnhancerFactory from '../store-enhancer';
import storeMiddlewareFactory from '../store-middleware';
import createComponentMatcher from '../create-component-matcher';
import { locationDidChange, locationInit } from '../action-creators';

export const makeRouter = ({
  routes,
  basename = '',
  history = useBasename(useQueries(createBrowserHistory))({basename}),
  routeMatcher = createComponentMatcher
}) => {

  // Create history
  // const history = useBasename(useQueries(createBrowserHistory))({basename});

  // Create matcher
  const matchRoute = routeMatcher(routes);

  // Create middleware
  const storeMiddleware = storeMiddlewareFactory(history);

  // Create enhancer
  const storeEnhancer = storeEnhancerFactory(history, matchRoute);

  const historyInit = (store) => {

    // Initialize
    store.dispatch(locationInit({
      location: history.getCurrentLocation(),
      matchRoute
    }));

    // History location changes dispatch locationDidChange
    history.listen(location => {
      if (location) {
        store.dispatch(locationDidChange({
          location, matchRoute
        }));
      }
    });

  };

  return {
    storeMiddleware,
    storeEnhancer,
    history,
    matchRoute,
    historyInit
  };
};

export const makeComponentRoute = (details, ...children) => {
  return Object.assign({}, details, children ? { children } : {});
};

export const makeHistory = (basename) => {
  return useBasename(useQueries(createBrowserHistory))({basename});
};
