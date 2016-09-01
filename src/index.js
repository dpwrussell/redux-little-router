import storeEnhancerFactory from './store-enhancer';
import storeMiddlewareFactory from './store-middleware';
import provideRouter, { RouterProvider } from './provider';
import { Link, PersistentQueryLink } from './link';
import Fragment from './fragment';
import ComponentFragment from './component-fragment';

import routerReducer from './reducer';
import createMatcher from './create-matcher';
import createComponentMatcher from './create-component-matcher';

import {
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK
} from './action-types';

import {
  locationDidChange,
  initializeCurrentLocation
} from './action-creators';

import {
  makeComponentRoute
} from './util';

export {
  // High-level Redux API
  storeEnhancerFactory,
  storeMiddlewareFactory,

  // Action Creators
  locationDidChange,
  initializeCurrentLocation,

  // React API
  provideRouter,
  RouterProvider,
  Link,
  PersistentQueryLink,
  Fragment,
  ComponentFragment,

  // Public action types
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK,

  // Low-level Redux utilities
  routerReducer,

  createMatcher,
  createComponentMatcher,

  // Route utilities
  makeComponentRoute
};
