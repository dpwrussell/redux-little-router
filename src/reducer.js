import { LOCATION_CHANGED, LOCATION_INIT } from './action-types';

export default (state, action) => {
  if (action.type === LOCATION_CHANGED || action.type === LOCATION_INIT) {
    console.log('Actually executing inside the reducer itself!!!!');
    // TODO Determine a need for this
    // No-op the initial route action
    // if (state && state.pathname === action.payload.pathname) {
    //   return state;
    // }

    return {
      ...action.payload,
      previous: state && state.current
    };
  }
  return state;
};
