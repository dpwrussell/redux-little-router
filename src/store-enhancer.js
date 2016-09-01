import routerReducer from './reducer';

const storeEnhancerFactory = matchRoute => createStore => (reducer, preloadedState, enhancer) {

  // Enhance the reducer
  const enhancedReducer = (state, action) => {
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

  return { ...store, matchRoute };
};

export default storeEnhancerFactory;
