import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { IAuthStore } from './authStore';
import Timeout = NodeJS.Timeout;

const TWO_SECONDS = 2000;

interface Web3ProviderProps {
  authStore?: IAuthStore;
}

interface Web3ProviderState {
  interval: Timeout | null;
  networkInterval: Timeout | null;
}

@inject('authStore')
@observer
class Web3Provider extends Component<Web3ProviderProps, Web3ProviderState> {
  constructor(props: Web3ProviderProps) {
    super(props);
    this.state = {
      interval: null,
      networkInterval: null,
    }
  }

  componentDidMount() {
    this.props.authStore!.checkWeb3Accounts();
    this.initPoll();
  }

  /**
   * Init Web3/account polling, and prevent duplicate interval.
   * @return {void}
   */
  initPoll() {
    if (!this.state.interval) {
      this.setState({interval: setInterval(this.props.authStore!.checkWeb3Accounts, TWO_SECONDS)});
    }
  }

  render() {
    return <span />;
  }
}

export default Web3Provider;
