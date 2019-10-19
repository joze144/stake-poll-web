import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Box, Container, Link as MaterialLink } from '@material-ui/core';

import { IEventSubscriptionStore } from '../EventSubscription/eventSubscriptionStore';
import { IWebsocketStore } from '../Websocket/websocketStore';
import { IAuthStore } from './authStore';
import AccountUnavailable from './AccountUnavailable';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid/Grid';
import InstallMetaMask from './InstallMetamask';
import LoginWithMetamaskIcon from './LoginWithMetamaskIcon';

interface LoginProps {
  authStore?: IAuthStore;
  websocketStore?: IWebsocketStore;
  eventSubscriptionStore?: IEventSubscriptionStore;
}

interface LoginState {
  error: boolean;
}

@inject('authStore', 'eventSubscriptionStore', 'websocketStore')
@observer
class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      error: false,
    };
    this.props.authStore!.checkIfHasWallet();
  }

  _onConnectMetamask = () => {
    this.props.authStore!.fetchWeb3Accounts();
  };

  _onLogin = () => {
    this.props.authStore!.login();
  };

  _onLogout = () => {
    this.props.authStore!.logout();
  };

  render() {
    const hasWallet = this.props.authStore!.hasWallet;
    const metamaskConnected = this.props.authStore!.metamaskConnected;
    const loggedIn = this.props.authStore!.loggedId;
    let form;
    let grid;

    if (loggedIn) {
      form = (<LoginWithMetamaskIcon text="Logout" onLogin={this._onLogout} />);
      grid = (<Grid container>
        <Grid item xs>
          <Link to={'/'}>Back home</Link>
        </Grid>
      </Grid>);
    } else if (hasWallet && !metamaskConnected) {
      form = (<LoginWithMetamaskIcon text="Connect Metamask" onLogin={this._onConnectMetamask} />);
      grid = (<Grid container>
        <Grid item xs>
          <Link to={'/'}>Back home</Link>
        </Grid>
      </Grid>);
    } else if (hasWallet && metamaskConnected) {
      form = (<LoginWithMetamaskIcon text="Login" onLogin={this._onLogin} />);
      grid = (<Grid container>
        <Grid item xs>
          <Link to={'/'}>Back home</Link>
        </Grid>
      </Grid>);
    } else {
      form = (
        <AccountUnavailable />
      );
      grid = (<Grid container>
        <Grid item xs>
          <Link to={'/'}>Back home</Link>
        </Grid>
        <Grid item>
          <MaterialLink href="https://metamask.io/">{"Install Metamask"}</MaterialLink>
        </Grid>
      </Grid>);
    }

    return (
      <Container className="pt-10" component="main" maxWidth="xs">
        <div>
          <Box component="span" m={1}>
            {form}
            {grid}
          </Box>
        </div>
      </Container>
    );
  }
}

export default Login;
