import React, { Component } from 'react';
import { IRouterStore } from './routerStore';

interface IProps {
  location: object;
  match: object;
  history: object;
}

const WithRouterStore = (store: IRouterStore) => (WrappedComponent: any) => {
  return class extends Component<IProps> {
    componentWillMount() {
      store.setRoute(this.props.location, this.props.match, this.props.history);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default WithRouterStore;
