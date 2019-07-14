import React, { Component, FormEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { v4 } from 'uuid';

import { Box, Button, InputLabel, TextField } from '@material-ui/core';

import { IEventSubscription, IEventSubscriptionState } from './IEventSubscription';

import { IEventSubscriptionStore } from '../stores/eventSubscriptionStore';
import { IWebsocketStore } from '../stores/websocketStore';
import { IAuthStore } from '../stores/authStore';

import { IncomingMessage } from '../events/IncomingMessage';
import { LoginEvent } from '../events/LoginEvent';

interface LoginProps {
  authStore?: IAuthStore;
  websocketStore?: IWebsocketStore;
  eventSubscriptionStore?: IEventSubscriptionStore;
}

const SUBSCRIBED_EVENTS = ['login-token'];

@inject('authStore', 'eventSubscriptionStore', 'websocketStore')
@observer
class Login extends Component<LoginProps, IEventSubscriptionState> implements IEventSubscription {
  constructor(props: LoginProps) {
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

  @observable username: string = '';
  @observable password: string = '';

  @action
  onUsernameChange = (e: any) => {
    //TODO: type
    this.username = e.target.value;
  };

  @action
  onPasswordChange = (e: any) => {
    //TODO: type
    this.password = e.target.value;
  };

  @action
  submitLogin = (event: FormEvent): void => {
    let loginEvent = new LoginEvent(this.username, this.password);
    this.props.websocketStore!.sendMessage(loginEvent);
    event.preventDefault();
  };

  @action
  submitLogout = (event: FormEvent) => {
    this.props.authStore!.logout();
    this.username = '';
    this.password = '';
    event.preventDefault();
  };

  @action
  handleMessage(message: IncomingMessage): void {
    console.log('message in component!');
    console.log(message);
  }

  render() {
    let form;

    if (this.props.authStore!.loggedId) {
      form = (
        <form onSubmit={this.submitLogout}>
          <InputLabel>Welcome, {this.props.authStore!.userDetails}</InputLabel>
          <br />
          <Button variant="contained" color="primary" type="submit">
            LOGOUT
          </Button>
        </form>
      );
    } else {
      form = (
        <form onSubmit={this.submitLogin}>
          <InputLabel>Login</InputLabel>
          <TextField
            label="Username"
            margin="normal"
            variant="outlined"
            value={this.username}
            onChange={this.onUsernameChange}
          />
          <TextField
            label="Password"
            margin="normal"
            variant="outlined"
            type="password"
            value={this.password}
            onChange={this.onPasswordChange}
          />
          <br />
          <Button variant="contained" color="primary" type="submit">
            LOGIN
          </Button>
        </form>
      );
    }

    return (
      <Box component="span" m={1}>
        {form}
      </Box>
    );
  }
}

export default Login;
