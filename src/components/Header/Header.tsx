import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { v4 } from 'uuid';
import { IAuthStore } from '../SignUp/authStore';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { IRouterStore } from '../Router/routerStore';
import Title from './Title';
import { withStyles } from '@material-ui/core';
import HideOnScroll from './HideOnScroll';
import LogoSvg from './LogoSvg';
import Link from '@material-ui/core/Link/Link';

interface HeaderProps {
  authStore?: IAuthStore;
  routerStore?: IRouterStore;
  classes: any;
}

const styles = () => ({
  root: {
    color: 'white',
    background: '#24292e',
    boxShadow: '0 2px 1px -1px #777',
    padding: '0 10px',
    flexGrow: 1,
  },
});

@inject('authStore', 'routerStore')
@observer
class Header extends Component<HeaderProps> {
  constructor(props: HeaderProps) {
    super(props);
  }

  _navigate = (path: string) => {
    // @ts-ignore
    this.props.routerStore!.history.push(path);
  };

  render() {
    const loggedIn = this.props.authStore!.loggedId;

    let toolbar;
    if (loggedIn) {
      toolbar = (
        <Toolbar>
          <Link href="#" onClick={() => this._navigate('/')} color="inherit">
            <LogoSvg />
          </Link>
          <Title key={v4()} />
          <Button color="inherit" onClick={() => this._navigate('/login')}>
            Logout
          </Button>
        </Toolbar>
      );
    } else {
      toolbar = (
        <Toolbar>
          <Link href="#" onClick={() => this._navigate('/')} color="inherit">
            <LogoSvg />
          </Link>
          <Title key={v4()} />
          <Button color="inherit" onClick={() => this._navigate('/login')}>
            Login
          </Button>
        </Toolbar>
      );
    }

    return (
      <React.Fragment>
        <HideOnScroll {...this.props}>
          <AppBar className={this.props.classes.root}>
            {toolbar}
          </AppBar>
        </HideOnScroll>
        <Toolbar />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Header);
