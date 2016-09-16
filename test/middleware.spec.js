import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { PUSH, REPLACE, GO, GO_BACK, GO_FORWARD } from '../src/action-types';
import storeMiddlewareFactory from '../src/store-middleware';

chai.use(sinonChai);

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

const createFakeStore = fakeData => ({
  getState() {
    return fakeData;
  }
});

const dispatchWithStoreOf = (storeData, action) => {
  const history = createHistoryStub();
  const middleware = storeMiddlewareFactory(history);
  const store = createFakeStore(storeData);

  let dispatched = null;
  const dispatch = middleware(store)(actionAttempt => dispatched = actionAttempt);

  dispatch(action);

  return {
    dispatched,
    history
  };
};

describe('middleware', () => {

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
      const action = {
        type: actionType
      };
      const result = dispatchWithStoreOf({}, action);

      expect(result.dispatched).to.not.exist;
      expect(result.history[method]).to.have.been.calledOnce;
    });
  });

  it('does not intercept other action types'), () => {
    const action = {
      type: 'PASS_THROUGH_MIDDLEWARE'
    };
    const result = dispatchWithStoreOf({}, action);

    expect(result.dispatched).to.equal(action);
  };

});
