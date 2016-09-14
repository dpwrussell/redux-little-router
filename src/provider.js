import React, { PropTypes } from 'react';


export class RouterProvider extends React.Component {

  constructor(props) {
    super(props);
    this.router = {
      store: props.store
    };
  }

  getChildContext() {
    return {
      router: this.router
    };
  }

  render() {
    return this.props.children;
  }
}

RouterProvider.childContextTypes = {
  router: PropTypes.object
};

export default ({ store }) => ComposedComponent => {
  const provideRouter = props => (
    <RouterProvider store={store}>
      <ComposedComponent {...props} />
    </RouterProvider>
  );
  return provideRouter;
};
