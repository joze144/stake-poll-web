import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router';
// Stores
import { createStores } from './components';
// Components
import WithRouterStore from './components/Router/WithRouterStore';
import Header from './components/Header/Header';
import Connected from './components/Websocket/Connected';
import Login from './components/SignUp/Login';
import PollViewerContainer from './components/PollViewer/PollViewerContainer';
import NotFound from './components/404';
// Styles
import { CssBaseline } from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import theme from './components/Theme';
import './styles/app.scss';
import CreatePollNew from './components/PollBuilder/CreatePoll';
import HistoryPage from './components/History/HistoryPage';
import Footer from './components/Footer/Footer';

const stores = createStores();

render(
  <Provider {...stores}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="container-flex">
          <Header />
          <Connected />
          <Switch>
            <Route path="/" exact component={WithRouterStore(stores.routerStore)(CreatePollNew)} />
            <Route path="/login" component={WithRouterStore(stores.routerStore)(Login)} />
            <Route path="/poll/:id" component={WithRouterStore(stores.routerStore)(PollViewerContainer)} />
            <Route path="/history" component={WithRouterStore(stores.routerStore)(HistoryPage)} />
            <Route path="*" component={WithRouterStore(stores.routerStore)(NotFound)} />
          </Switch>
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
