import {makeRoute } from '../../src';

const root = { routeComponent: '/', name:'root' };
const home = { routeComponent:'home', name:'home' };
const messages = { routeComponent:'messages', name:'messages' };
const team = { routeComponent:':team', name:'team' };
const channel = { routeComponent:':channel', name:'channel' };
const spookyparam = { routeComponent:':spookyparam', name:'3spooky5me' };
const global = { routeComponent:'global', name:'global' };
const absolute = { routeComponent:'a/b/c/:d', name:'absolute' }

const routes =
makeRoute(root,
  makeRoute(home,
    makeRoute(messages,
      makeRoute(team,
        makeRoute(channel)
      )
    ),
    makeRoute(global,
      makeRoute(channel)
    ),
    makeRoute(spookyparam)
  ),
  makeRoute(absolute)
);

export default routes;
