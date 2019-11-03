import { action, observable } from 'mobx';
import { RootStore } from '../rootStore';

export interface IRouterStore {
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
  }
}
