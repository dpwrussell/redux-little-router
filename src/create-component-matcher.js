import UrlPattern from 'url-pattern';
import { join as pathJoin } from 'path';
import memoize from 'lru-memoize';

export default routes => {

  const fn = incomingUrl => {

    // Discard query strings
    const route = incomingUrl.split('?')[0]; // eslint-disable-line no-magic-numbers

    const traverseRoutes = (toMatch, routeComponent, parentPath = '') => {
      if (routeComponent.path) {
        const path = pathJoin(parentPath, routeComponent.path);
        const pattern = new UrlPattern(path);
        const match = pattern.match(toMatch);
        if (match) {
          return [{
            route: path,
            params: match,
            routeComponent
          }];
        }

        const children = routeComponent.children;
        if (children) {
          for (const child of children) {
            const routeComponents = traverseRoutes(toMatch, child, path);
            if (routeComponents) {
              return [routeComponent].concat(routeComponents);
            }
          }
        }
      }
      return undefined;
    };

    // Returns an array where the final index contains an object containing
    // the route, matched params and the routeComponents. All other indicies
    // contain just the routeComponents
    const matchedRoute = traverseRoutes(route, routes);

    if (!matchedRoute) {
      return null;
    }

    // eslint-disable-next-line no-magic-numbers
    const finalRouteComponent = matchedRoute[matchedRoute.length - 1];

    // Return:
    // {
    //   route: The route which has actually been matched,
    //   params: Any parameters (or empty object) that have been matched,
    //   routeComponents: The tree components involved in this route
    // }

    // eslint-disable-next-line no-magic-numbers
    const routeComponents = (matchedRoute.slice(0, -1).concat(finalRouteComponent.routeComponent)).map(r => {
      const childlessR = Object.assign({}, r);
      delete childlessR.children;
      return childlessR;
    });

    return {
      route: finalRouteComponent.route,
      params: finalRouteComponent.params,
      routeComponents
    };

  };

  return memoize()(fn);

};
