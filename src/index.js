import storeEnhancerFactory from './store-enhancer';
import storeMiddlewareFactory from './store-middleware';
import provideRouter, { RouterProvider } from './provider';
import { Link, PersistentQueryLink } from './link';
import ComponentFragment from './react/ComponentFragment';
import PlaceholderFragment from './react/PlaceholderFragment';
import routerReducer from './reducer';
import createComponentMatcher from './create-component-matcher';
import { LOCATION_CHANGED, LOCATION_INIT, PUSH, REPLACE, GO, GO_FORWARD, GO_BACK } from './action-types';
import { locationDidChange, locationInit } from './action-creators';
import { makeRouter, makeServerRouter,
         assembleComponentRoute, assembleComponentRouteWithMeta,
         makeHistory } from './util';
import codeSplitMiddleware from './code-split/middleware';
import codeSplitUtils from './code-split/util';
import routeFetchMiddleware from './route-fetch/middleware';
import routeFetchUtils from './route-fetch/util';

export {
  // High-level Redux API
  storeEnhancerFactory,
  storeMiddlewareFactory,

  // Action Creators
  locationDidChange,
  locationInit,

  // React API
  provideRouter,
  RouterProvider,
  Link,
  PersistentQueryLink,
  ComponentFragment,
  PlaceholderFragment,

  // Public action types
  LOCATION_CHANGED,
  LOCATION_INIT,
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK,

  // Low-level Redux utilities
  routerReducer,
  createComponentMatcher,

  // Utilities
  makeRouter,
  makeServerRouter,
  assembleComponentRoute,
  assembleComponentRouteWithMeta,
  makeHistory,

  // Middleware
  codeSplitMiddleware,
  codeSplitUtils,
  routeFetchMiddleware,
  routeFetchUtils
};
