import { IEventListenerStore } from './IEventListenerStore';

import { IWebsocketStore, WebsocketStore } from './websocketStore';
import { AuthStore, IAuthStore } from './authStore';
import { EventSubscriptionStore, IEventSubscriptionStore } from './eventSubscriptionStore';
import { FieldListStore, IFieldListStore } from './fieldListStore';

export interface IRootStore {
  authStore?: IAuthStore;
  websocketStore?: IWebsocketStore;
  eventSubscriptionStore?: IEventSubscriptionStore;
  fieldListStore?: IFieldListStore;
  getSubscribedStores(message: string): IEventListenerStore[];
}

export class RootStore implements IRootStore {
  authStore: AuthStore;
  websocketStore: WebsocketStore;
  eventSubscriptionStore: EventSubscriptionStore;
  fieldListStore: FieldListStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.websocketStore = new WebsocketStore(this);
    this.eventSubscriptionStore = new EventSubscriptionStore(this);
    this.fieldListStore = new FieldListStore(this);
  }

  public getSubscribedStores(messageType: string): IEventListenerStore[] {
    let stores = [];
    if (this.authStore!.getSubscribedEvents.indexOf(messageType) > -1) stores.push(this.authStore);

    return stores;
  }
}
