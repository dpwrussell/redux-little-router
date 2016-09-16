import routerReducer from './reducer';

const storeEnhancerFactory = (history, matchRoute) => createStore => (reducer, preloadedState, enhancer) => {

  // Enhance the reducer
  const enhancedReducer = (state, action) => {
    console.log('Executing enhancedReducer', state.router);
    const vanillaState = {...state};
    delete vanillaState.router;
    return {
      ...reducer(vanillaState, action),
      router: routerReducer(state && state.router, action)
    };
  };

  const store = createStore(
    enhancedReducer,
    preloadedState,
    enhancer
  );

  return { ...store, history, matchRoute };
};

export default storeEnhancerFactory;
