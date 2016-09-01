import {
  PUSH, REPLACE, GO,
  GO_BACK, GO_FORWARD
} from './action-types';

const storeMiddlewareFactory = history => store => next => action => {

  switch (action.type) {
    case PUSH:
      history.push(action.payload);
      return null;
    case REPLACE:
      history.replace(action.payload);
      return null;
    case GO:
      history.go(action.payload);
      return null;
    case GO_BACK:
      history.goBack();
      return null;
    case GO_FORWARD:
      history.goForward();
      return null;
    default:
      return next(action);
  }

};

export default storeMiddlewareFactory;
