import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { v4 } from 'uuid';
import { IAuthStore } from '../SignUp/authStore';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { IRouterStore } from '../Router/routerStore';
import Title from './Title';
import { withStyles } from '@material-ui/core';
import HideOnScroll from './HideOnScroll';
import LogoSvg from './LogoSvg';
import Link from '@material-ui/core/Link/Link';
import PersonIcon from '@material-ui/icons/Person';
import HistoryIcon from '@material-ui/icons/History';
import Tooltip from '@material-ui/core/Tooltip';
import EthBalance from '../Wallet/EthBalance';

interface HeaderProps {
  authStore?: IAuthStore;
  routerStore?: IRouterStore;
  classes: any;
}

const styles = () => ({
  root: {
    boxShadow: '0 2px 1px -1px #777',
    padding: '0 10px',
    flexGrow: 1,
  }
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
          <Link component="button" onClick={() => this._navigate('/')} color="inherit">
            <LogoSvg />
          </Link>
          <Title key={v4()} />
          <EthBalance />
          <Tooltip title="Poll History">
            <div className="m-10">
              <Link component="button" onClick={() => this._navigate('/history')} color="inherit">
                <HistoryIcon/>
              </Link>
            </div>
          </Tooltip>
          <Tooltip title="User">
            <div className="m-10">
              <Link component="button" onClick={() => this._navigate('/login')} color="inherit">
                <PersonIcon />
              </Link>
            </div>
          </Tooltip>
        </Toolbar>
      );
    } else {
      toolbar = (
        <Toolbar>
          <Link component="button" onClick={() => this._navigate('/')} color="inherit">
            <LogoSvg />
          </Link>
          <Title key={v4()} />
          <Tooltip title="User">
            <div className="m-10">
              <Link component="button" onClick={() => this._navigate('/login')} color="inherit">
                <PersonIcon />
              </Link>
            </div>
          </Tooltip>
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
