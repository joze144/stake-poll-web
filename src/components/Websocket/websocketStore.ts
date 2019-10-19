import { action, observable } from 'mobx';

import { RootStore } from '../rootStore';

import { Message } from './events/Message';
import { IncomingMessage } from '../IncomingMessage';

export interface IWebsocketStore {
  websocket: WebSocket | null;
  connected: boolean;
  startedTime: number;
  connectedIn: number;
  setConnected(): void;
  setDisconnected(): void;
  sendMessage(message: object): boolean;
  onMessage(message: IncomingMessage): void;
}

export class WebsocketStore implements IWebsocketStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable websocket: WebSocket | null = null;
  @observable connected: boolean = false;
  @observable startedTime: number = 0;
  @observable connectedIn: number = 0;

  @observable messageQueue: IncomingMessage[] = [];

  private pushToQueue(message: IncomingMessage): void {
    this.messageQueue = this.messageQueue.filter((qMessage: IncomingMessage) => {
      return qMessage.messageType !== message.messageType;
    });
    this.messageQueue.push(message);
  }

  private sendMessagesFromQueue() {
    while (this.messageQueue.length > 0 && this.connected) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  public sendMessage(message: IncomingMessage): boolean {
    if (!this.connected || !this.websocket) {
      this.pushToQueue(message);
      return false;
    }
    let authHeader = this.rootStore.authStore!.getAuthorizationHeader;
    const headers = { authHeader, messageType: message.messageType };
    const payload = new Message(message, headers);

    console.log(payload);
    this.websocket!.send(JSON.stringify(payload));
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
    this.sendMessagesFromQueue();
  }

  @action
  public setDisconnected(): void {
    this.connected = false;
    this.startedTime = new Date().getTime();
  }
}