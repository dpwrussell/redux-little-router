import { expect } from 'chai';
import { createComponentMatcher } from '../src';

import routes from './fixtures/routes';
describe('createMatcher', () => {
  it('matches URLs and returns the route matched, their params and their value in the route hash', () => {
    const matchRoute = createComponentMatcher(routes);

    expect(matchRoute('/home')).to.deep.equal({
      route: '/home',
      params: {},
      result: [
        {
          name: 'root',
          routeComponent: '/'
        },
        {
          name: 'home',
          routeComponent: 'home'
        }
      ]
    });

    expect(matchRoute('/home/messages')).to.deep.equal({
      route: '/home/messages',
      params: {},
      result: [
        {
          name: 'root',
          routeComponent: '/'
        },
        {
          name: 'home',
          routeComponent: 'home'
        },
        {
          name: 'messages',
          routeComponent: 'messages'
        }
      ]
    });

    expect(matchRoute('/home/messages/a-team')).to.deep.equal({
      route: '/home/messages/:team',
      params: {
        team: 'a-team'
      },
      result: [
        {
          name: 'root',
          routeComponent: '/'
        },
        {
          name: 'home',
          routeComponent: 'home'
        },
        {
          name: 'messages',
          routeComponent: 'messages'
        },
        {
          name: 'team',
          routeComponent: ':team'
        }
      ]
    });

    expect(matchRoute('/home/messages/a-team/the-wat-channel')).to.deep.equal({
      route: '/home/messages/:team/:channel',
      params: {
        team: 'a-team',
        channel: 'the-wat-channel'
      },
      result: [
        {
          name: 'root',
          routeComponent: '/'
        },
        {
          name: 'home',
          routeComponent: 'home'
        },
        {
          name: 'messages',
          routeComponent: 'messages'
        },
        {
          name: 'team',
          routeComponent: ':team'
        },
        {
          name: 'channel',
          routeComponent: ':channel'
        }
      ]
    });

    expect(matchRoute('/home/doot')).to.deep.equal({
      route: '/home/:spookyparam',
      params: {
        spookyparam: 'doot'
      },
      result: [
        {
          name: 'root',
          routeComponent: '/'
        },
        {
          name: 'home',
          routeComponent: 'home'
        },
        {
          name: '3spooky5me',
          routeComponent: ':spookyparam'
        }
      ]
    });

    expect(matchRoute('/home/global/channel-4')).to.deep.equal({
      route: '/home/global/:channel',
      params: {
        channel: 'channel-4'
      },
      result: [
        {
          name: 'root',
          routeComponent: '/'
        },
        {
          name: 'home',
          routeComponent: 'home'
        },
        {
          name: 'global',
          routeComponent: 'global'
        },
        {
          name: 'channel',
          routeComponent: ':channel'
        }
      ]
    });

    expect(matchRoute('/a/b/c/dee')).to.deep.equal({
      route: '/a/b/c/:d',
      params: {
        d: 'dee'
      },
      result: [
        {
          name: 'root',
          routeComponent: '/'
        },
        {
          name: 'absolute',
          routeComponent: 'a/b/c/:d'
        }
      ]
    });

  });
});
