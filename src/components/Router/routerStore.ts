import { action, observable } from 'mobx';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { RootStore } from '../rootStore';

const history = createBrowserHistory();

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

    history.listen(location => {
      ReactGA.set({ page: location.pathname }); // Update the user's current page
      ReactGA.pageview(location.pathname); // Record a pageview for the given page
    });
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
