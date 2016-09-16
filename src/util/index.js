import createBrowserHistory from 'history/lib/createBrowserHistory';
import createMemoryHistory from 'history/lib/createMemoryHistory';
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

export const makeServerRouter = (options) => {
  return makeRouter({
    history: useBasename(useQueries(createMemoryHistory))(),
    ...options
  });
};

export const assembleComponentRoute = (componentRoute, ...children) => {
  return Object.assign({}, componentRoute, children ? { children } : {});
};

export const assembleComponentRouteWithMeta = (componentRoute, meta, ...children) => {
  return Object.assign(
    {},
    componentRoute,
    meta ? meta : {},
    children ? { children } : {}
  );
};

export const makeHistory = (basename) => {
  return useBasename(useQueries(createBrowserHistory))({basename});
};
