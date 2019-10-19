import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

import { createStores } from './components';

import Websocket from './components/Websocket/Websocket';

import './styles/app.scss';
import { Route, Switch } from 'react-router';
import Home from './components/Home';
import Login from './components/SignUp/Login';
import NotFound from './components/404';
import { BrowserRouter as Router } from 'react-router-dom';
import WithRouterStore from './components/Router/WithRouterStore';
import Header from './components/Header/Header';
import { CssBaseline } from '@material-ui/core';
import Connected from './components/Websocket/Connected';
import FieldList from './components/FieldList';

const stores = createStores();

render(
  <Provider {...stores}>
    <div>
      <CssBaseline />
      <Websocket url={'wss://skljoc.si/ws'} />
      <Router>
        <div>
          <Header />
          <Connected />
          <Switch>
            <Route path="/" exact component={WithRouterStore(stores.routerStore)(Home)} />
            <Route path="/login" component={WithRouterStore(stores.routerStore)(Login)} />
            <Route path="/writings" exact component={WithRouterStore(stores.routerStore)(FieldList)} />
            <Route path="*" component={WithRouterStore(stores.routerStore)(NotFound)} />
          </Switch>
        </div>
      </Router>
    </div>
  </Provider>,
  document.getElementById('root'),
);
