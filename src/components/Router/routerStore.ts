import { action, computed, observable } from 'mobx';
import { RootStore } from '../rootStore';
import { IEventListenerStore } from '../EventSubscription/IEventListenerStore';
import { IncomingMessage } from '../IncomingMessage';
import { OutboundEvents } from './EventTypes';

export interface IRouterStore extends IEventListenerStore {
  location: Location;
  match: object;
  history: History;
  setRoute(location: object, match: object, history: object): void;
}

export class RouterStore implements IRouterStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable match = {};
  @observable location: any;
  @observable history: any;

  @action
  setRoute(location: Location, match: object, history: History) {
    this.location = location;
    this.match = match;
    this.history = history;

    console.log(match);
  }

  @computed
  public get getSubscribedEvents(): string[] {
    return [OutboundEvents.MoveUiToState];
  }

  @action
  handleMessage(message: IncomingMessage): void {
    switch (message['targetState']) {
      case 'forgot-password':
        this.history.push('/forgot-password');
        return;
      default:
        return;
    }
  }
}
