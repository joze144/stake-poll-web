import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Channel, Socket } from 'phoenix';
import { IWebsocketStore } from './websocketStore';

import { IAuthStore } from '../SignUp/authStore';
import { IPollViewerStore } from '../PollViewer/pollViewerStore';
import { observable } from 'mobx';

interface PhoenixWSProps {
  authStore?: IAuthStore;
  pollViewerStore?: IPollViewerStore;
  websocketStore?: IWebsocketStore;
}

@inject('authStore', 'pollViewerStore', 'websocketStore')
@observer
class PhoenixWS extends Component<PhoenixWSProps, {}> {
  constructor(props: PhoenixWSProps) {
    super(props);
    this.props.websocketStore!.setDisconnected();
    this.props.websocketStore!.websocket = new Socket(this.props.websocketStore!.WSEndpoint, {
      params: {token: this.props.authStore!.jwtToken},
      reconnectAfterMs: (tries: number) => {
        return [1000, 2000, 3000][tries - 1] || 3000;
      },
      heartbeatIntervalMs: 10000,
    });
  }

  @observable pollChannel: Channel | null = null;

  setupWebsocket() {
    let websocket = this.props.websocketStore!.websocket;

    websocket!.onOpen(this.onOpen);
    websocket!.onMessage(this.onMessage);
    websocket!.onClose(this.onClose);
    websocket!.onError(this.onError);
    websocket!.connect();
  }

  componentDidMount() {
    this.setupWebsocket();
    this.props.websocketStore!.joinPollChannel();
  }

  componentWillUnmount() {
    this.props.websocketStore!.websocket!.disconnect();
  }

  onMessage = () => {};

  onOpen = () => {
    this.props.websocketStore!.setConnected();
    this.props.websocketStore!.joinPollChannel();
  };

  onClose = () => {
    console.log('Socket Close');
    this.props.websocketStore!.setDisconnected();
  };

  onError = () => {
    console.log('Socket Error');
    this.props.websocketStore!.setDisconnected();
  };

  render() {
    return (
      <span />
    );
  }
}

export default PhoenixWS;
