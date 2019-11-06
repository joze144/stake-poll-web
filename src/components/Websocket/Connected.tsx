import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { IWebsocketStore } from './websocketStore';
import ConnectedSnackbar from './ConnectedSnackbar';

interface ConnectedProps {
  websocketStore?: IWebsocketStore;
}

@inject('websocketStore')
@observer
class Connected extends Component<ConnectedProps> {
  constructor(props: ConnectedProps) {
    super(props);
  }

  render() {
    const timer = this.props.websocketStore!.connected ? this.props.websocketStore!.connectedIn : 0;

    return <ConnectedSnackbar connected={this.props.websocketStore!.connected} time={timer} />;
  }
}

export default Connected;
