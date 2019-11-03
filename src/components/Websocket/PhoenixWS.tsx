import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Socket } from 'phoenix';
import { IWebsocketStore } from './websocketStore';

import { IAuthStore } from '../SignUp/authStore';

interface PhoenixWSProps {
  authStore?: IAuthStore;
  websocketStore?: IWebsocketStore;
}

@inject('authStore', 'websocketStore')
@observer
class PhoenixWS extends Component<PhoenixWSProps, {}> {
  constructor(props: PhoenixWSProps) {
    super(props);
    this.props.websocketStore!.setDisconnected();
    this.props.websocketStore!.websocket = new Socket(this.props.websocketStore!.WSEndpoint, {
      reconnectAfterMs: (tries: number) => {
        return [1000, 2000, 3000][tries - 1] || 3000;
      },
      heartbeatIntervalMs: 10000,
    });
  }

  setupWebsocket() {
    let websocket = this.props.websocketStore!.websocket;

    websocket.onOpen(this.onOpen);
    websocket.onMessage(this.onMessage);
    websocket.onClose(this.onClose);
    websocket.onError(this.onError);
    websocket.connect({ token: this.props.authStore!.jwtToken });
  }

  componentDidMount() {
    this.setupWebsocket();
  }

  componentWillUnmount() {
    this.props.websocketStore!.websocket.close();
  }

  onMessage = (data: any) => {
    console.log('MESSAGE');
    console.log(data);
  };

  onOpen = (i: any) => {
    console.log(i);
    this.props.websocketStore!.setConnected();
  };

  onClose = (i: any) => {
    console.log(i);
    this.props.websocketStore!.setDisconnected();
  };

  onError = (e: any) => {
    this.props.websocketStore!.setDisconnected();
  };

  render() {
    return (
      <span />
    );
  }
}

export default PhoenixWS;
