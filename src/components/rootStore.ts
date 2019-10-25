import * as localForage from 'localforage';
import { create } from 'mobx-persist';

import { IEventListenerStore } from './EventSubscription/IEventListenerStore';
import { IWebsocketStore, WebsocketStore } from './Websocket/websocketStore';
import { AuthStore, IAuthStore } from './SignUp/authStore';
import { EventSubscriptionStore, IEventSubscriptionStore } from './EventSubscription/eventSubscriptionStore';
import { IRouterStore, RouterStore } from './Router/routerStore';
import { CreatePollStore, ICreatePollStore } from './PollBuilder/createPollStore';

export interface IRootStore {
  authStore?: IAuthStore;
  createPollStore?: ICreatePollStore;
  eventSubscriptionStore?: IEventSubscriptionStore;
  routerStore?: IRouterStore;
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
  routerStore: RouterStore = new RouterStore(this);
  websocketStore: WebsocketStore = new WebsocketStore(this);

  constructor() {
    hydrate('authentication', this.authStore);
    hydrate('createpoll', this.createPollStore);
  }

  public getSubscribedStores(messageType: string): IEventListenerStore[] {
    let stores = [];
    if (this.routerStore!.getSubscribedEvents.indexOf(messageType) > -1) stores.push(this.routerStore);

    return stores;
  }
}
