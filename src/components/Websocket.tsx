import React, { Component } from 'react';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import { IWebsocketStore } from '../stores/websocketStore';

interface WebsocketProps {
  url: string;
  debug?: boolean;
  reconnect?: boolean;
  reconnectIntervalInMilliSeconds?: number;
  websocketStore?: IWebsocketStore;
}

interface WebsocketState {
  attempts: number;
  shouldReconnect: boolean;
  timeoutID: any;
  url: string;
}

@inject('websocketStore')
@observer
class Websocket extends Component<WebsocketProps, WebsocketState> {
  static defaultProps = {
    debug: false,
    reconnect: true,
    reconnectIntervalInMilliSeconds: 0,
  };

  constructor(props: WebsocketProps) {
    super(props);
    this.state = {
      url: this.props.url,
      attempts: 1,
      shouldReconnect: this.props.reconnect!,
      timeoutID: 0,
    };
    this.props.websocketStore!.setDisconnected();
    this.props.websocketStore!.websocket = new WebSocket(this.props.url);
  }

  logging(logline: string) {
    if (this.props.debug === true) {
      console.log(logline);
    }
  }

  generateInterval(k: number) {
    if (this.props.reconnectIntervalInMilliSeconds! > 0) {
      return this.props.reconnectIntervalInMilliSeconds;
    }
    // Reconnect timer exponential back-off, but capped to 10 seconds
    return Math.min(10, Math.pow(2, k) - 1) * 1000;
  }

  setupWebsocket() {
    let websocket = this.props.websocketStore!.websocket!;

    websocket.onopen = () => {
      this.logging('Websocket connected');
      this.onOpen();
    };

    websocket.onmessage = (evt: any) => {
      this.onMessage(evt.data);
    };

    this.setState({ shouldReconnect: this.props.reconnect! });
    websocket.onclose = () => {
      this.logging('Websocket disconnected');
      this.onClose();
      if (this.props.reconnect) {
        let time = this.generateInterval(this.state.attempts);
        this.setState({
          timeoutID: setTimeout(() => {
            this.setState({ attempts: this.state.attempts + 1 });
            this.props.websocketStore!.websocket = new WebSocket(this.props.url);
            this.setupWebsocket();
          }, time),
        });
      }
    };
  }

  componentDidMount() {
    this.setupWebsocket();
  }

  componentWillUnmount() {
    this.setState({ shouldReconnect: false });
    clearTimeout(this.state.timeoutID);
    this.props.websocketStore!.websocket!.close();
  }

  @action
  onMessage(data: string) {
    this.props.websocketStore!.onMessage(JSON.parse(data));
  }

  @action
  onOpen() {
    this.props.websocketStore!.setConnected();
  }

  @action
  onClose() {
    this.props.websocketStore!.setDisconnected();
  }

  render() {
    return <span />;
  }
}

export default Websocket;
