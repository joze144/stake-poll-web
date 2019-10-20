import * as localForage from 'localforage';
import { create } from 'mobx-persist';

import { IEventListenerStore } from './EventSubscription/IEventListenerStore';
import { IWebsocketStore, WebsocketStore } from './Websocket/websocketStore';
import { AuthStore, IAuthStore } from './SignUp/authStore';
import { EventSubscriptionStore, IEventSubscriptionStore } from './EventSubscription/eventSubscriptionStore';
import { IRouterStore, RouterStore } from './Router/routerStore';
import { FieldListStore, IFieldListStore } from './Game/fieldListStore';
import { GameStore, IGameStore } from './Game/gameStore';

export interface IRootStore {
  authStore?: IAuthStore;
  eventSubscriptionStore?: IEventSubscriptionStore;
  fieldListStore?: IFieldListStore;
  gameStore?: IGameStore;
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
  eventSubscriptionStore: EventSubscriptionStore = new EventSubscriptionStore(this);
  fieldListStore: FieldListStore = new FieldListStore(this);
  gameStore: GameStore = new GameStore(this);
  routerStore: RouterStore = new RouterStore(this);
  websocketStore: WebsocketStore = new WebsocketStore(this);

  constructor() {
    hydrate('authentication', this.authStore);
  }

  public getSubscribedStores(messageType: string): IEventListenerStore[] {
    let stores = [];
    if (this.routerStore!.getSubscribedEvents.indexOf(messageType) > -1) stores.push(this.routerStore);

    return stores;
  }
}
