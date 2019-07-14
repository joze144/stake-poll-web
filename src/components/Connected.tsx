import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import { v4 } from 'uuid';
import { Button } from '@material-ui/core';

import { IEventSubscription, IEventSubscriptionState } from './IEventSubscription';

import { IEventSubscriptionStore } from '../stores/eventSubscriptionStore';
import { IWebsocketStore } from '../stores/websocketStore';

import { IncomingMessage } from '../events/IncomingMessage';

interface ConnectedProps {
  websocketStore?: IWebsocketStore;
  eventSubscriptionStore?: IEventSubscriptionStore;
}

const SUBSCRIBED_EVENTS = ['login-token'];

@inject('eventSubscriptionStore', 'websocketStore')
@observer
class Connected extends Component<ConnectedProps, IEventSubscriptionState> implements IEventSubscription {
  constructor(props: ConnectedProps) {
    super(props);
    this.state = { componentId: v4() };
    this.props.eventSubscriptionStore!.registerComponent(this, SUBSCRIBED_EVENTS);
  }

  public get getComponentId(): string {
    return this.state.componentId;
  }

  componentWillUnmount(): void {
    this.props.eventSubscriptionStore!.unregisterComponent(this);
  }

  @action
  action = () => {
    this.props.websocketStore!.sendMessage({ messageType: 'ping' });
  };

  @action
  handleMessage(message: IncomingMessage): void {
    console.log('message in component!');
    console.log(message);
  }

  render() {
    const color = this.props.websocketStore!.connected ? 'green' : 'red';
    const text = this.props.websocketStore!.connected ? 'Connected' : 'Disconnected';
    const timer = this.props.websocketStore!.connected
      ? this.props.websocketStore!.connectedIn.toString() + ' ms'
      : 'Connecting...';

    return (
      <div>
        <h1 style={{ color: color }}>{text}</h1>
        <h2>Connected in: {timer}</h2>
        <Button variant="contained" color="primary" onClick={this.action}>
          send Message
        </Button>
      </div>
    );
  }
}

export default Connected;
