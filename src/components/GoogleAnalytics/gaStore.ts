import { RootStore } from '../rootStore';
import ReactGA from 'react-ga';
import { config } from '../../config/config';
import { action } from 'mobx';

export interface IGaStore {
  initiate(): void,
  setUser(): void
}

export class GaStore implements IGaStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  initiate(): void {
    ReactGA.initialize(config.gaTrackingId);
  }

  @action
  setUser(): void {
    if (this.rootStore.authStore!.userId) {
      ReactGA.set({
        userId: this.rootStore.authStore!.userId
      })
    }
  }

  @action
  sendEvent(category: string, action: string): void {
    ReactGA.event({
      category: category,
      action: action,
    });
  }
}
