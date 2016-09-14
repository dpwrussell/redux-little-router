import { expect } from 'chai';
import { createComponentMatcher } from '../src';

import componentRoutes from './fixtures/component-routes';

describe('createComponentMatcher', () => {
  it('matches URLs and returns the route matched, their params and routeComponents constituating it', () => {
    const matchRoute = createComponentMatcher(componentRoutes);

    expect(matchRoute('/home')).to.deep.equal({
      route: '/home',
      params: {},
      routeComponents: [
        {
          name: 'root',
          path: '/'
        },
        {
          name: 'home',
          path: 'home'
        }
      ]
    });

    expect(matchRoute('/home/messages')).to.deep.equal({
      route: '/home/messages',
      params: {},
      routeComponents: [
        {
          name: 'root',
          path: '/'
        },
        {
          name: 'home',
          path: 'home'
        },
        {
          name: 'messages',
          path: 'messages'
        }
      ]
    });

    expect(matchRoute('/home/messages/a-team')).to.deep.equal({
      route: '/home/messages/:team',
      params: {
        team: 'a-team'
      },
      routeComponents: [
        {
          name: 'root',
          path: '/'
        },
        {
          name: 'home',
          path: 'home'
        },
        {
          name: 'messages',
          path: 'messages'
        },
        {
          name: 'team',
          path: ':team'
        }
      ]
    });

    expect(matchRoute('/home/messages/a-team/the-wat-channel')).to.deep.equal({
      route: '/home/messages/:team/:channel',
      params: {
        team: 'a-team',
        channel: 'the-wat-channel'
      },
      routeComponents: [
        {
          name: 'root',
          path: '/'
        },
        {
          name: 'home',
          path: 'home'
        },
        {
          name: 'messages',
          path: 'messages'
        },
        {
          name: 'team',
          path: ':team'
        },
        {
          name: 'channel',
          path: ':channel'
        }
      ]
    });

    expect(matchRoute('/home/doot')).to.deep.equal({
      route: '/home/:spookyparam',
      params: {
        spookyparam: 'doot'
      },
      routeComponents: [
        {
          name: 'root',
          path: '/'
        },
        {
          name: 'home',
          path: 'home'
        },
        {
          name: '3spooky5me',
          path: ':spookyparam'
        }
      ]
    });

    expect(matchRoute('/home/global/channel-4')).to.deep.equal({
      route: '/home/global/:channel',
      params: {
        channel: 'channel-4'
      },
      routeComponents: [
        {
          name: 'root',
          path: '/'
        },
        {
          name: 'home',
          path: 'home'
        },
        {
          name: 'global',
          path: 'global'
        },
        {
          name: 'channel',
          path: ':channel'
        }
      ]
    });

    expect(matchRoute('/a/b/c/dee')).to.deep.equal({
      route: '/a/b/c/:d',
      params: {
        d: 'dee'
      },
      routeComponents: [
        {
          name: 'root',
          path: '/'
        },
        {
          name: 'absolute',
          path: 'a/b/c/:d'
        }
      ]
    });

  });
});
