// const UrlPattern = require('url-pattern');
// const pathJoin = require('path').join;
//
// const root = { routeComponent: '/', name:'root' };
// const home = { routeComponent:'home', name:'home' };
// const messages = { routeComponent:'messages', name:'messages' };
// const team = { routeComponent:':team', name:'team' };
// const channel = { routeComponent:':channel', name:'channel' };
// const spookyparam = { routeComponent:':spookyparam', name:'3spooky5me' };
//
// const routes = Object.assign(root, {
//   children: [Object.assign(home, {
//     children: [Object.assign(messages, {
//       children: [Object.assign(team, {
//         children: [Object.assign(channel, {})]
//       })]
//     }), Object.assign(spookyparam, {})]
//   })]
// });
//
// const traverseRoutes = (toMatch, routeComponent, parentPath='') => {
//   const path = pathJoin(parentPath, routeComponent.routeComponent);
//   const pattern = new UrlPattern(path);
//   const match = pattern.match(toMatch);
//   if (match) {
//     return [{
//       route: path,
//       params: match,
//       routeComponent
//     }];
//   }
//
//   const children = routeComponent.children;
//   if (children) {
//     for (const child of children) {
//       const result = traverseRoutes(toMatch, child, path);
//       if (result) {
//         return [routeComponent].concat(result)
//       }
//     }
//   }
// };
//
// const x = traverseRoutes('/home/messages', routes);
// console.log(x);

//
//
// // build the route list, but do it recursively
// const routeList = new Map();
// const traverseRoutes = (route, parentPath='') => {
//   const path = parentPath === '/' ? `/${route.route}` : `${parentPath}/${route.route || ''}`;
//   const pattern = new UrlPattern(path);
//   routeList.set(pattern, route);
//
//   const children = route.children;
//   if (children) {
//     for (const child of children) {
//       traverseRoutes(child, path);
//     }
//   }
// };
//
// traverseRoutes(routes)
//
// for (routeKey of routeList.keys()) {
//   // console.log(routeKey);
//   // const pattern = new UrlPattern(routeKey);
//   const match = routeKey.match('/home/messages');
//   if (match) {
//     const route = routeList.get(routeKey);
//     console.log(route);
//   }
//
// }


// const root = () => ({ routeComponent: '/', name:'root' });
// const home = () => ({ routeComponent:'home', name:'home' });
// const messages = () => ({ routeComponent:'messages', name:'messages' });
// const team = () => ({ routeComponent:':team', name:'team' });
// const channel = () => ({ routeComponent:':channel', name:'channel' });
// const spookyparam = () => ({ routeComponent:':spookyparam', name:'3spooky5me' });

const root = { routeComponent: '/', name:'root' };
const home = { routeComponent:'home', name:'home' };
const messages = { routeComponent:'messages', name:'messages' };
const team = { routeComponent:':team', name:'team' };
const channel = { routeComponent:':channel', name:'channel' };
const spookyparam = { routeComponent:':spookyparam', name:'3spooky5me' };

function makeRoute(details, children) {
  return Object.assign({}, details, children ? { children } : {});
}

const routes = makeRoute(root, [
  makeRoute(home, [
    makeRoute(messages, [
      makeRoute(team, [
        makeRoute(channel)
      ])
    ]),
    makeRoute(spookyparam)
  ])
]);

console.log(routes);
console.log(routes.children[0]);
console.log(routes.children[0].children[0]);
console.log(routes.children[0].children[0].children[0]);
console.log(routes.children[0].children[0].children[0].children[0]);
console.log(routes.children[0].children[1]);





// import { createStore, applyMiddleware, compose } from 'redux';
// import thunkMiddleware from 'redux-thunk';
// import { createStoreWithRouter } from 'redux-little-router';
// import DevTools from './DevTools';
// import reducers from '../reducers';
// import { routeFetch, auth } from '../middleware';
//
// import createBrowserHistory from 'history/lib/createBrowserHistory';
// import useBasename from 'history/lib/useBasename';
// import useQueries from 'history/lib/useQueries';
//
// // TODO Configure these
// const routes = {
//   '/': {
//     title: 'Home'
//   },
//   '/home': {
//     title: 'Test Home',
//     auth: true
//   },
//   '/home/2': {
//     title: 'Test Home 2'
//   },
//   '/other': {
//     title: 'Test Other'
//   },
//   '/login': {
//     title: 'Test Login'
//   },
//   '/canonical/:canonicalId': {
//     title: 'Canonical'
//   }
// };
//
// // Create basename
// const basename = '';
//
// // Create history
// const history = useBasename(useQueries(createBrowserHistory))({basename});
//
// // Create matcher
// const matchRoute = createMatcher(routes);
//
// // Create middleware
// const storeMiddleware = storeMiddlewareFactory(history);
//
// // Create enhancer
// const storeEnhancer = storeEnhancerFactory({
//   matchRoute,
//   history
// });
//
// export default function configureStore(initialState = undefined) {
//   const enhancer = compose(
//
//     // Middleware you want to use in development:
//     applyMiddleware(
//       thunkMiddleware,
//       storeMiddleware,
//       // auth,
//       // routeFetch
//     ),
//
//     createStoreWithRouter({
//       routes,
//       pathname: location.pathname, // optional, the beginning URL
//       // basename: ''
//     }),
//
//     // Required! Enable Redux DevTools with the monitors you chose
//     DevTools.instrument()
//   );
//
//   const store = createStore(
//     reducers,
//     initialState,
//     enhancer
//   );
//
//   // History location changes dispatch locationDidChange
//   history.listen(location => {
//     if (location) {
//       store.dispatch(locationDidChange({
//         location, matchRoute
//       }));
//     }
//   });
//
//   return store;
// }
