import { action, observable } from 'mobx';

import { RootStore } from '../rootStore';
import { IncomingMessage } from '../IncomingMessage';

import {config} from '../../config/config';

export interface IWebsocketStore {
  websocket: any;
  connected: boolean;
  startedTime: number;
  connectedIn: number;
  WSEndpoint: string;
  setConnected(): void;
  setDisconnected(): void;
  sendMessage(message: object): boolean;
  onMessage(message: IncomingMessage): void;
  connectToTopic(topic: string): void;
  disconnectFromTopic(topic: string): void;
}

export class WebsocketStore implements IWebsocketStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable websocket: any = null;
  @observable connected: boolean = false;
  @observable startedTime: number = 0;
  @observable connectedIn: number = 0;
  @observable WSEndpoint: string = config.wsUrl;

  @action
  connectToTopic(topic: string): void {
  }

  @action
  disconnectFromTopic(topic: string): void {
  }

  public sendMessage(message: IncomingMessage): boolean {
    console.log(message);
    return true;
  }

  public onMessage(message: IncomingMessage): void {
    if (!message || !message.messageType) {
      console.error('No message type in the payload!');
      console.log(message);
      return;
    }
    console.log(message);

    // Forward to stores
    const subscribedStores = this.rootStore.getSubscribedStores(message.messageType);
    subscribedStores.map(store => store.handleMessage(message));

    // Forward to components
    this.rootStore.eventSubscriptionStore!.handleMessage(message);
  }

  @action
  public setConnected(): void {
    this.connected = true;
    this.connectedIn = new Date().getTime() - this.startedTime;
  }

  @action
  public setDisconnected(): void {
    this.connected = false;
    this.startedTime = new Date().getTime();
  }
}
