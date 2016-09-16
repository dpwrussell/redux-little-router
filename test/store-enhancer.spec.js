import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { compose, applyMiddleware, createStore } from 'redux';
import { install, combineReducers } from 'redux-loop';

import {
  LOCATION_CHANGED, PUSH, REPLACE,
  GO, GO_BACK, GO_FORWARD
} from '../src/action-types';

import { makeRouter, makeServerRouter } from '../src/util';

import { locationDidChange, locationInit } from '../src/action-creators';

import routes from './fixtures/component-routes';

chai.use(sinonChai);

// Store with spy on dispatch. Also attaches that spy to the store for
// access
const storeWithSpyEnhancer = nextCreateStore => (reducer, initialState, enhancer) => {
  const store = nextCreateStore(reducer, initialState, enhancer);
  const spy = sinon.spy(store, 'dispatch');
  return {...store, dispatch: spy, storeSpy: spy};
};

const createHistoryStub = () => ({
  push: sinon.stub(),
  replace: sinon.stub(),
  go: sinon.stub(),
  goBack: sinon.stub(),
  goForward: sinon.stub(),
  listen: sinon.stub(),
  createLocation: () => ({
    pathname: '/home',
    query: {
      yo: 'yo'
    }
  })
});

// TODO Initialstate does not apply to the router anymore
// const defaultFakeInitialState = {
//   router: {
//     pathname: '/home/messages/a-team/pity-fool'
//   }
// };

const createFakeStore = ({
  initialState,
  useHistoryStub = true,
  isLoop = false,
  enhancerOptions = {},
  serverRender = false
} = {}) => {

  const reducers = isLoop
                 ? combineReducers({ stuff: state => state })
                 : state => state;

  const history = useHistoryStub
                ? createHistoryStub()
                : undefined;

  const router = serverRender
               ? makeServerRouter({ routes, history, ...enhancerOptions })
               : makeRouter({ routes, history, ...enhancerOptions });

  let middlewareSpy;
  const spyMiddleware = store => next => {
    const spy = sinon.spy(next);
    if (middlewareSpy !== undefined) {
      console.log('Extremely bad, replacing spy');
    }
    middlewareSpy = spy;
    console.log('spying!');
    return action => {
      return spy(action);
    };
  };


  const enhancer = compose(
    storeWithSpyEnhancer,
    applyMiddleware(
      // TODO Add a spy on the middleware?
      spyMiddleware,
      router.storeMiddleware
    ),

    router.storeEnhancer
  );

  const store = createStore(
    reducers,
    initialState,
    enhancer
  );

  store.middlewareSpy = middlewareSpy;

  return { store, router };
};

/*
const fakeStore = ({
  initialState = defaultFakeInitialState,
  useHistoryStub = true,
  isLoop = false,
  enhancerOptions = {}
} = {}) => {
  const historyStub = {
    push: sinon.stub(),
    replace: sinon.stub(),
    go: sinon.stub(),
    goBack: sinon.stub(),
    goForward: sinon.stub(),
    listen: sinon.stub(),
    createLocation: () => ({
      pathname: '/home',
      query: {
        yo: 'yo'
      }
    })
  };

  const enhancers = [
    createStoreWithSpy,
    useHistoryStub ? createStoreWithRouter({
      history: historyStub,
      routes,
      ...enhancerOptions
    }) : createStoreWithRouter({
      routes,
      ...enhancerOptions
    })
  ];

  if (isLoop) {
    enhancers.push(install());
  }

  const store = createStore(
    isLoop ? combineReducers({
      stuff: state => state
    }) : state => state,
    initialState,
    compose(...enhancers)
  );

  return { store, historyStub };
};
*/

describe('Router store enhancer', () => {
  it('updates the pathname in the state tree after dispatching history actions', done => {
    const { store } = createFakeStore();

    store.subscribe(() => {
      const state = store.getState();
      expect(state).to.have.deep.property('router.routeComponents')
        .that.deep.equals([{ name: 'channel' }]);
      done();
    });

    store.dispatch({
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/home/messages/a-team/fool-pity',
        routeComponents: [
          {
            name: 'channel'
          }
        ]
      }
    });
  });


  it('can create its own browser history', done => {
    const { store } = createFakeStore({
      useHistoryStub: false,
      enhancerOptions: {
        forServerRender: false
      }
    });

    store.subscribe(() => {
      const state = store.getState();
      expect(state).to.have.deep.property('router.routeComponents')
        .that.deep.equals([{ name: 'channel' }]);
      done();
    });

    store.dispatch({
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/home/messages/a-team/fool-pity',
        routeComponents: [
          {
            name: 'channel'
          }
        ]
      }
    });
  });

  it('can create its own server history', done => {
    const { store } = createFakeStore({
      useHistoryStub: false,
      serverRender: true
    });

    store.subscribe(() => {
      const state = store.getState();
      expect(state).to.have.deep.property('router.routeComponents')
        .that.deep.equals([{ name: 'channel' }]);
      done();
    });

    store.dispatch({
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/home/messages/a-team/fool-pity',
        routeComponents: [
          {
            name: 'channel'
          }
        ]
      }
    });
  });

  it('supports Redux Loop', done => {
    const { store } = createFakeStore({ isLoop: true });

    store.subscribe(() => {
      const state = store.getState();
      expect(state).to.have.deep.property('router.routeComponents')
        .that.deep.equals([{ name: 'channel' }]);
      done();
    });

    store.dispatch({
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/home/messages/a-team/fool-pity',
        routeComponents: [
          {
            name: 'channel'
          }
        ]
      }
    });
  });

  it('combines the location descriptor and the route match into a LOCATION_CHANGED action', () => {
    const locationChangedAction = locationDidChange({
      location: {
        action: 'PUSH',
        basename: '/test',
        pathname: '/things',
        query: {
          test: 'ing'
        }
      },
      matchRoute: sinon.stub().returns({
        params: {
          fakeParam: 'things'
        },
        routeComponents: [
          {
            title: 'things'
          }
        ]
      })
    });

    expect(locationChangedAction).to.deep.equal({
      type: LOCATION_CHANGED,
      payload: {
        action: 'PUSH',
        basename: '/test',
        pathname: '/things',
        query: {
          test: 'ing'
        },
        params: {
          fakeParam: 'things'
        },
        routeComponents: [
          {
            title: 'things'
          }
        ]
      }
    });
  });


  it('dispatches a LOCATION_CHANGED action on location change', () => {
    const { store, router: { history } } = createFakeStore();
    store.dispatch({
      type: PUSH,
      payload: {}
    });

    expect(history.push).to.be.calledOnce;
    expect(store.storeSpy).to.be.calledOnce;
    expect(store.middlewareSpy).to.be.calledOnce;
  });

  const actionMethodMap = {
    [PUSH]: 'push',
    [REPLACE]: 'replace',
    [GO]: 'go',
    [GO_BACK]: 'goBack',
    [GO_FORWARD]: 'goForward'
  };

  Object.keys(actionMethodMap).forEach(actionType => {
    const method = actionMethodMap[actionType];

    it(`calls history.${method} when intercepting ${actionType}`, () => {
      const { store, router: { history } } = createFakeStore();
      store.dispatch({
        type: actionType,
        payload: {
          pathname: '/nonsense'
        }
      });

      expect(history[method]).to.have.been.calledOnce;
    });
  });

  it('passes normal actions through the dispatch chain', () => {
    const { store, router: { history } } = createFakeStore();
    store.dispatch({
      type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
      payload: {}
    });

    Object.keys(actionMethodMap).forEach(actionType => {
      const method = actionMethodMap[actionType];
      expect(history[method]).to.not.have.been.called;
    });
    expect(store.storeSpy).to.be.calledOnce;
    expect(store.middlewareSpy).to.be.calledOnce;
  });


});
