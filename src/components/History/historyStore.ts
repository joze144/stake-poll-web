import { RootStore } from '../rootStore';
import { action } from 'mobx';

export interface IHistoryStore {
  loadUserHistory(page: number): void;
}

export class HistoryStore implements IHistoryStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  loadUserHistory(page: number): void {

  }


}
