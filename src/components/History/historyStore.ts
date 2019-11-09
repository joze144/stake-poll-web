import { RootStore } from '../rootStore';
import { action, flow, observable } from 'mobx';
import { getPollHistory } from './historyService';

class HistoryPoll {
  pollId: string;
  title: string;
  timestamp: Date;
  chosenOptionContent: string | null;

  constructor(pollId: string, title: string, timestamp: Date, chosenOptionContent: string | null) {
    this.pollId = pollId;
    this.title = title;
    this.chosenOptionContent = chosenOptionContent;
    this.timestamp = timestamp;
  }
}

export interface IHistoryStore {
  accessedHistory: boolean;
  historyEntries: Array<HistoryPoll>;
  allEntries: number;
  lastLoadedPage: number;
  totalPages: number | null;
  loading: boolean;
  clearHistory(): void;
  loadHistoryOnHydration(): void;
  loadUserHistory(page: number): void;
  onPage(on: boolean): void;
}

export class HistoryStore implements IHistoryStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable accessedHistory: boolean = false;
  @observable historyEntries: Array<HistoryPoll> = [];
  @observable loading: boolean = false;
  @observable lastLoadedPage: number = 1;
  @observable totalPages: number | null = null;
  @observable allEntries: number = 0;

  @action
  clearHistory(): void {
    this.historyEntries = [];
    this.lastLoadedPage = 1;
    this.totalPages = null;
    this.allEntries = 0;
  }

  @action
  onPage(on: boolean): void {
    this.accessedHistory = on;
  }

  @action
  loadHistoryOnHydration(): void {
    if (this.accessedHistory && this.rootStore.authStore!.loggedId) {
      this.fetchHistoryFlow(this, 1);
    }
  }

  @action
  loadUserHistory(page: number): void {
    if (!this.rootStore.authStore!.loggedId) {
      this.clearHistory();
      return;
    }

    this.fetchHistoryFlow(this, page);
  }

  private static mergeNewHistoryWithExisting(existing: Array<HistoryPoll>, newEntries: Array<HistoryPoll>): Array<HistoryPoll> {
    const filtered = newEntries
      .filter(({pollId}) => {
        const e = existing.find(({pollId: existingPollId}) => existingPollId === pollId);
        return !e;
      });

    if (existing.length === 0) {
      return [...existing, ...filtered];
    }
    const {timestamp} = existing[0];
    const before = filtered.filter(({timestamp: entryTimestamp}) => {
      return entryTimestamp > timestamp;
    });
    const after = filtered.filter(({timestamp: entryTimestamp}) => {
      return entryTimestamp < timestamp;
    });
    return [...before, ...existing, ...after];
  }

  fetchHistoryFlow = flow(function*(store: HistoryStore, page: number): any {
    try {
      store.loading = true;
      const data = yield getPollHistory(store.rootStore.authStore.jwtToken, page);
      const {entries, total_entries, total_pages} = data;
      const newEntries = entries.map(({poll_id, title, chosen_option_content, timestamp}: any) => {
        return new HistoryPoll(poll_id, title, timestamp, chosen_option_content);
      });
      store.historyEntries = HistoryStore.mergeNewHistoryWithExisting(store.historyEntries, newEntries);
      store.totalPages = total_pages;
      store.allEntries = total_entries;
      store.lastLoadedPage = page;
      store.loading = false;
    } catch (e) {
      store.loading = false;
    }
  })
}
