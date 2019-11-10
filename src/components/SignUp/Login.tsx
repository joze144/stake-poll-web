import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { IAuthStore } from './authStore';
import { Box, Container, Link as MaterialLink } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import LoginWithMetamaskIcon from './LoginWithMetamaskIcon';
import AccountUnavailable from './AccountUnavailable';

interface LoginProps {
  authStore?: IAuthStore;
}

@inject('authStore')
@observer
class Login extends Component<LoginProps, {}> {
  constructor(props: LoginProps) {
    super(props);
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
    const data = loggedIn ?
      {text: "Logout", method: this._onLogout} : (hasWallet && !metamaskConnected) ?
        {text: "Connect Metamask", method: this._onConnectMetamask} : (hasWallet && metamaskConnected) ?
          {text: "Login", method: this._onLogin} : null;

    let form;
    let grid;
    if (!data) {
      form = (<AccountUnavailable/>);
      grid = (<Grid container>
        <Grid item xs>
          <Link to={'/'}>Back home</Link>
        </Grid>
        <Grid item>
          <MaterialLink href="https://metamask.io/">{"Install Metamask"}</MaterialLink>
        </Grid>
      </Grid>);
    } else {
      form = (<LoginWithMetamaskIcon text={data.text} onLogin={data.method} />);
      grid = (<Grid container>
        <Grid item xs>
          <Link to={'/'}>Back home</Link>
        </Grid>
      </Grid>);
    }

    return (
      <Container className="pt-40" component="main" maxWidth="xs">
        <div>
          <Box component="span" p={1}>
            {form}
            {grid}
          </Box>
        </div>
      </Container>
    );
  }
}

export default Login;
