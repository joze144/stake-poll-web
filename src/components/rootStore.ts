import * as localForage from 'localforage';
import { create } from 'mobx-persist';

import { IEventListenerStore } from './EventSubscription/IEventListenerStore';
import { IWebsocketStore, WebsocketStore } from './Websocket/websocketStore';
import { AuthStore, IAuthStore } from './SignUp/authStore';
import { EventSubscriptionStore, IEventSubscriptionStore } from './EventSubscription/eventSubscriptionStore';
import { IRouterStore, RouterStore } from './Router/routerStore';
import { CreatePollStore, ICreatePollStore } from './PollBuilder/createPollStore';
import { IPollViewerStore, PollViewerStore } from './PollViewer/pollViewerStore';
import { HistoryStore, IHistoryStore } from './History/historyStore';
import { WalletStore, IWalletStore } from './Wallet/walletStore';
import { GaStore, IGaStore } from './GoogleAnalytics/gaStore';

export interface IRootStore {
  authStore?: IAuthStore;
  createPollStore?: ICreatePollStore;
  eventSubscriptionStore?: IEventSubscriptionStore;
  GaStore?: IGaStore;
  historyStore?: IHistoryStore;
  pollViewerStore?: IPollViewerStore;
  routerStore?: IRouterStore;
  walletStore?: IWalletStore;
  websocketStore?: IWebsocketStore;
  getSubscribedStores(message: string): IEventListenerStore[];
}

const hydrate = create({
  storage: localForage,
  jsonify: false,
});

export class RootStore implements IRootStore {
  authStore: AuthStore = new AuthStore(this);
  createPollStore: CreatePollStore = new CreatePollStore(this);
  eventSubscriptionStore: EventSubscriptionStore = new EventSubscriptionStore(this);
  gaStore: GaStore = new GaStore(this);
  historyStore: HistoryStore = new HistoryStore(this);
  pollViewerStore: PollViewerStore = new PollViewerStore(this);
  routerStore: RouterStore = new RouterStore(this);
  walletStore: WalletStore = new WalletStore(this);
  websocketStore: WebsocketStore = new WebsocketStore(this);

  constructor() {
    hydrate('authentication', this.authStore).then(() => {
      this.authStore.hydrated = true;
      this.websocketStore.connectSocket();
      this.historyStore.loadHistoryOnHydration();
      this.pollViewerStore.loadPollOnHydration();
      this.gaStore.initiate();
    });
    hydrate('createpoll', this.createPollStore);
    hydrate('wallet', this.walletStore);
  }

  public getSubscribedStores(messageType: string): IEventListenerStore[] {
    let stores = [];
    if (this.pollViewerStore!.getSubscribedEvents.indexOf(messageType) > -1) stores.push(this.pollViewerStore);
    if (this.walletStore!.getSubscribedEvents.indexOf(messageType) > -1) stores.push(this.walletStore);

    return stores;
  }
}
