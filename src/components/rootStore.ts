import { IEventListenerStore } from './EventSubscription/IEventListenerStore';
import { IWebsocketStore, WebsocketStore } from './Websocket/websocketStore';
import { AuthStore, IAuthStore } from './SignUp/authStore';
import { EventSubscriptionStore, IEventSubscriptionStore } from './EventSubscription/eventSubscriptionStore';
import { IRouterStore, RouterStore } from './Router/routerStore';
import { FieldListStore, IFieldListStore } from './Game/fieldListStore';

export interface IRootStore {
  authStore?: IAuthStore;
  websocketStore?: IWebsocketStore;
  eventSubscriptionStore?: IEventSubscriptionStore;
  routerStore?: IRouterStore;
  fieldListStore?: IFieldListStore;
  getSubscribedStores(message: string): IEventListenerStore[];
}

export class RootStore implements IRootStore {
  authStore: AuthStore = new AuthStore(this);
  websocketStore: WebsocketStore = new WebsocketStore(this);
  eventSubscriptionStore: EventSubscriptionStore = new EventSubscriptionStore(this);
  routerStore: RouterStore = new RouterStore(this);
  fieldListStore: FieldListStore = new FieldListStore(this);

  public getSubscribedStores(messageType: string): IEventListenerStore[] {
    let stores = [];
    if (this.routerStore!.getSubscribedEvents.indexOf(messageType) > -1) stores.push(this.routerStore);

    return stores;
  }
}
