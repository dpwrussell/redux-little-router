# redux-routing-toolkit [![Build Status](https://travis-ci.org/dpwrussell/redux-routing-toolkit.svg?branch=master)](https://travis-ci.org/dpwrussell/redux-routing-toolkit) [![Coverage Status](https://coveralls.io/repos/github/dpwrussell/redux-routing-toolkit/badge.svg?branch=master)](https://coveralls.io/github/dpwrussell/redux-routing-toolkit?branch=master)

`redux-routing-toolkit` is a collection of modules for doing routing with Redux

## redux-little-router

As I was formulating the idea for this project, another amazing project was released, https://github.com/FormidableLabs/redux-little-router. This is a great project and fulfils many of the use cases I wished to write this for. However, I wanted to take some aspects of it even further in terms of decoupling the routing from the components. I have made extensive use of infrastructure setup and code from that project and am enormously indebted to the authors.

The primary difference from `redux-little-router` is the syntax of the `routes` definition, how they are matched and how this allows ultimate flexibility in the view layer.

Finally, as it is a toolkit it also provides several useful complimentary modules, such as middleware for "needing" async actions and middleware for code-splitting.

## Principles

- The URL is just another member of the state tree.
- URL changes are just plain actions.
- Route matching should be simple and extendable.
- Routes should be based on constituent partial routes.

While the core router does not depend on any view library, it provides flexible React bindings and components.

## Why another router?

To understand why `redux-routing-toolkit` exists, check out the excellent `redux-little-router` blog series, "Let the URL do the Talking":

[Part 1](http://formidable.com/blog/2016/07/11/let-the-url-do-the-talking-part-1-the-pain-of-react-router-in-redux/)
[Part 2](http://formidable.com/blog/2016/07/19/let-the-url-do-the-talking-part-2-bargaining-and-acceptance-with-redux-and-react-router/)
[Part 3](http://formidable.com/blog/2016/07/25/let-the-url-do-the-talking-part-3-empower-the-url-with-redux-little-router/)

While React Router is a great, well-supported library, it hoards URL state within the view layer and makes certain Redux patterns difficult, if not impossible. [This chart](http://imgur.com/a/Trlzw) outlines a major issue in accessing URL state from outside of React Router.

`redux-routing-toolkit` makes URL state a first-class citizen of your Redux store and abstracts cross-browser navigation and routing into a pure Redux API.

## Redux usage

To hook into Redux applications, `redux-routing-toolkit` uses a store enhancer that wraps the `history` module and adds current and previous router state to your store. It also uses a middleware to intercept navigation actions and calls their equivalent method in `history`. The enhancer listens for the `history` location changes and dispatches rich actions containing the URL, parameters and the partials that constitute the route. Those partials may have metadata assigned to them.

### Wiring up the boilerplate

The following is an example of a `redux-routing-toolkit` setup that works on both the browser and the server. At the bare minimum, you'll need to install the store enhancer (`createStoreWithRouter`) into your Redux store.

```js
import { compose, createStore } from 'redux';
import { createStoreWithRouter } from 'redux-routing-toolkit';

import yourReducer from './your-app';

// routes is a javascript object structure.
// There are many ways to build the route and the metadata that is
// supplied only need match the requirements of whatever mechanism is
// making use of the routes. This may be middleware or React components
// to control what is rendered depending on the current route.
//
// Part of what differentiates redux-routing-toolkit from
// redux-little-router is that this routing structure can be built
// from routeComponents.
//
// The only mandatory property of routeComponents is the `path`, but it is
// highly advisable to also include a `name`. If making use of nested
// routes then it is also mandatory not to use `children` for any other
// purpose.
//
// The value of the path property can be any string that when assembled
// into a route, can be used by https://github.com/snd/url-pattern for URL
// matching and parameter extraction.
//
// The data from all the routeComponents is attached to the `router` key
// of the state tree when its corresponding route is matched and dispatched.
//
// Some helper functions exist to make the process of assembling the
// routes easier. We make use of `assembleComponentRoute` here

import { assembleComponentRoute as assemble } from 'redux-routing-toolkit';
import ExampleComponent from './ExampleComponent';

// Define the routeComponents
const root = { path: '/', name: 'root' };
const items = { path: 'items', name: 'items' };
const item = { path: 'item/:itemId', name: 'item' };
// An example of a routeComponent to make use of the `PlaceholderFragment`
// React component
const comp = { path: 'comp', name: 'comp', component: ExampleComponent, componentProps: { a: 1, b: 2 } };
const compchild = { path: 'compchild', name: 'compchild' };
const abs = { path: 'several/levels/deep/:anId', name: 'abs' };

// Compose the routeComponents
// A single '/' component is always required so the tree has a starting point,
// but otherwise routes can be nested or flat as desired
const routes =
assemble(root,
  assemble(items),
  assemble(item),
  assemble(comp,
    assemble(compchild)
  ),
  assemble(abs)
);

// This is an example of initializing the router in a client-only
// single-page app. Passing in at least the `pathname` will allow
// `createStoreWithRouter` to automatically setup the initial state
// for the first browser location.
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { makeRouter } from 'redux-routing-toolkit';
import reducers from '../reducers';
import routes from '../routes';

// makeRouter handles most typical use cases
const router = makeRouter({
  routes
});

const enhancer = compose(

  applyMiddleware(
    thunkMiddleware,
    router.storeMiddleware
  ),

  router.storeEnhancer
);

const store = createStore(
  reducers,
  initialState,
  enhancer
);

// History location changes dispatch locationInit (Required)
router.historyInit(store);
```

### Provided actions and state

On location changes, the store enhancer dispatches a LOCATION_CHANGED action that contains at least the following properties:

```js
// For a URL matching /messages/:user
{
  url: '/messages/a-user-has-no-name',
  params: {
    user: 'a-user-has-no-name'
  },
  query: { // if your `history` instance uses `useQueries`
    some: 'thing'
  },
  result: {
    arbitrary: 'data that you defined in your routes object!'
  }
}
```

Your custom middleware can intercept this action to dispatch new actions in response to URL changes.

The reducer consumes this action and adds the following to the root of the state tree on the `router` property:

```js
{
  url: '/messages/a-user-has-no-name',
  params: {
    user: 'a-user-has-no-name'
  },
  query: {
    some: 'thing'
  },
  result: {
    arbitrary: 'data that you defined in your routes object!'
  },
  previous: {
    url: '/messages',
    params: {},
    result: {
      more: 'arbitrary data that you defined in your routes object!'
    }
  }
}
```

Your custom reducers or selectors can derive a large portion of your app's state from the URLs in the `router` property.

## React bindings and usage

`redux-little-router` provides the following to make React integration easier:

- A `<Fragment>` component that conditionally renders children based on current route and/or location conditions.
- A `<Link>` component that sends navigation actions to the middleware when tapped or clicked. `<Link>` respects default modifier key and right-click behavior. A sibling component, `<PersistentQueryLink>`, persists the existing query string on navigation
- A `provideRouter` HOC that passes down everything `<Fragment>` and `<Link>` need via context.

`redux-little-router` assumes and requires that `react-redux` is installed for any of your components that consume `<Fragment>` or `<Link>`. You can access the router state using `react-redux`'s `connect()`:

```js
export default connect(state => ({
  router: state.router
}))(YourComponent);
```

### `<Fragment>`
Think of `<Fragment>` as the midpoint of a "flexibility continuum" that starts with raw switch statements and ends with React Router's `<Route>` component. Fragments can live anywhere within the React tree, making split-pane or nested UIs easy to work with.

The simplest fragment is one that displays when a route is active:

```es6
<Fragment forRoute='/home/messages/:team'>
  <p>This is the team messages page!</p>
</Fragment>
```

You can also specify a fragment that displays on multiple routes:

```es6
<Fragment forRoutes={['/home/messages', '/home']}>
  <p>This displays in a couple of places!</p>
</Fragment>
```

Finally, you can match a fragment against anything in the current `location` object:

```es6
<Fragment withConditions={location => location.query.superuser}>
  <p>Superusers see this on all routes!</p>
</Fragment>
```

You can also use `withConditions` in conjunction with either `forRoute` or `forRoutes`.

### `<Link>`

Using the `<Link>` component is simple:

```es6
<Link className='anything' href='/yo'>
  Share Order
</Link>
```

Alternatively, you can pass in a [location descriptor](https://github.com/ReactTraining/history/blob/master/docs/Location.md#location-descriptors) to `href`. This is useful for passing query objects:

```es6
<Link className='anything' href={{
  pathname: '/home/messages/a-team?test=ing',
  query: {
    test: 'ing'
  }
}}>
  Share Order
</Link>
```

`<Link>` takes an optional valueless prop, `replaceState`, that changes the link navigation behavior from `pushState` to `replaceState` in the History API.

### `provideRouter` or `<RouterProvider>`

Like React Router's `<Router>` component, you'll want to wrap `provideRouter` around your app's top-level component like so:

```es6
import React from 'react';
import ReactDOM from 'react-dom';
import { provideRouter } from 'redux-little-router';
import YourAppComponent from './';

import createYourStore from './state';

const AppComponentWithRouter = provideRouter({
  store: createYourStore()
})(YourAppComponent);

ReactDOM.render(<AppComponentWithRouter />, document.getElementById('root');
```

This allows `<Fragment>` and `<Link>` to obtain their `history` and `dispatch` instances without manual prop passing.

If you'd rather use a plain component instead of a higher-ordered component, use `<RouterProvider>` like so:

```es6
import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'redux-little-router';
import YourAppComponent from './';

import createYourStore from './state';

ReactDOM.render(
  <RouterProvider store={createYourStore()}>
    <YourComponent />
  </RouterProvider>
  document.getElementById('root');
)
```

## Environment

`redux-little-router` requires an ES5 compatible environment (no IE8).

## Stability

`redux-little-router` is **alpha software**. Expect minor breaking API changes.
