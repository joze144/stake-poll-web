import { action, flow, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { v4 } from 'uuid';
import { RootStore } from '../rootStore';
import { createPoll } from './createPollService';

export class PollOption {
  @persist id: string;
  @persist content: string;

  constructor(id: string, content: string) {
    this.id = id;
    this.content = content;
  }
}

export interface ICreatePollStore {
  title: string;
  newOptionContent: string;
  options: Array<PollOption>;
  step: number;
  error: string;
  loading: boolean;
  addOption(): void;
  clearAll(): void;
  confirmTitle(): void;
  removeOption(id: string): void;
  optionChange(content: string): void;
  titleChange(title: string): void;
  typeChange(type: string): void;
  submitPoll(): void;
}

export class CreatePollStore implements ICreatePollStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    this.options.push(new PollOption(v4(), 'NICE'));
    this.options.push(new PollOption(v4(), 'BAM'));
    this.options.push(new PollOption(v4(), 'DABAST'));
  }

  @observable type: string = "stake";
  @persist @observable step: number = 1;
  @persist @observable title: string = "";
  @persist @observable newOptionContent: string = "";
  @persist('list', PollOption) @observable options: Array<PollOption> = [];
  @observable error: string = "";
  @observable loading: boolean = false;

  @action
  confirmTitle(): void {
    this.step = 2;
  }

  @action
  clearAll(): void {
    this.step = 1;
    this.title = "";
    this.options = [];
    this.error = "";
    this.loading = false;
    this.newOptionContent = "";
  }

  @action
  addOption(): void {
    if (!this.newOptionContent || this.newOptionContent.trim() === "") {
      return;
    }
    this.options.push(new PollOption(v4(), this.newOptionContent.trim()));
    this.newOptionContent = "";
    this.error = "";
  }

  @action
  removeOption(optionId: string): void {
    this.options = this.options.filter(({id}) => {
      return id !== optionId;
    });
  }

  @action
  optionChange(content: string): void {
    this.newOptionContent = content;
  }

  @action
  titleChange(title: string): void {
    this.title = title;
    this.error = "";
  }

  @action
  typeChange(type: string): void {
    this.type = type;
    this.error = "";
  }

  @action
  submitPoll(): void {
    if (!this.title || this.title === "") {
      this.error = "Missing Poll Question!";
      return;
    }

    if (this.options.length < 2) {
      this.error = "Need at least TWO poll option.";
      return;
    }

    this.createPollFlow(this);
  }

  private createPollFlow = flow(function* (store: CreatePollStore): any {
    try {
      const pollId = v4();
      store.loading = true;
      yield createPoll(store.rootStore.authStore.jwtToken, pollId, store.title, store.options);
      store.rootStore.gaStore!.sendEvent('Pool', 'Created new poll: ' + store.title);
      store.step = 1;
      store.title = "";
      store.options = [];
      store.newOptionContent = "";
      store.error = "";
      store.type = "stake";
      store.loading = false;
      store.rootStore.routerStore.history.push('/poll/' + pollId);
    } catch (e) {
      store.error = "Something went wrong. Please try again.";
      store.loading = false;
    }
  })
}
