import { action, observable } from 'mobx';
import { Channel, Socket } from 'phoenix';
import { RootStore } from '../rootStore';
import { IncomingMessage } from '../IncomingMessage';

import { config } from '../../config/config';

export interface IWebsocketStore {
  websocket: Socket | null;
  connected: boolean;
  startedTime: number;
  connectedIn: number;
  pollChannel: Channel | null;
  WSEndpoint: string;
  joinPollChannel(): void;
  leavePollChannel(): void;
  setConnected(): void;
  setDisconnected(): void;
  sendMessage(message: object): boolean;
}

export class WebsocketStore implements IWebsocketStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable websocket: Socket | null = null;
  @observable connected: boolean = false;
  @observable startedTime: number = 0;
  @observable connectedIn: number = 0;
  @observable WSEndpoint: string = config.wsUrl;
  @observable pollChannel: Channel | null = null;

  public sendMessage(message: IncomingMessage): boolean {
    console.log("Poll Channel Message!");
    console.log(message);
    return true;
  }

  onMessage = (message: IncomingMessage): void => {
    if (!message || !message.message_type) {
      console.error('No message type in the payload!');
      console.log(message);
      return;
    }

    // Forward to subscribed stores
    const subscribedStores = this.rootStore.getSubscribedStores(message.message_type);
    subscribedStores.map(store => store.handleMessage(message));

    // Forward to subscribed components
    this.rootStore.eventSubscriptionStore!.handleMessage(message);
  };

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

  @action
  public joinPollChannel(): void {
    if (this.rootStore.pollViewerStore!.pollId && this.websocket && !this.pollChannel) {
      const topic = 'poll:' + this.rootStore.pollViewerStore!.pollId;
      this.pollChannel = this.websocket.channel(topic, {});
      this.pollChannel.on('poll_updates', this.onMessage);
      this.pollChannel
        .join()
        .receive('ok', () => {
        })
        .receive('error', (e: any) => {
          console.error("Channel error");
        })
        .receive('timeout', () => {
          console.error('channel timeout');
        });
    }
  }

  @action
  public leavePollChannel(): void {
    if (this.pollChannel) {
      this.pollChannel.leave();
      this.pollChannel = null;
    }
  }
}
