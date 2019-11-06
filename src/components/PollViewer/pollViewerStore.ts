import { RootStore } from '../rootStore';
import { IEventListenerStore } from '../EventSubscription/IEventListenerStore';
import { action, computed, flow, observable } from 'mobx';
import { IncomingMessage } from '../IncomingMessage';
import { PollOption } from '../PollBuilder/createPollStore';
import { fetchPollData, voteOnPoll } from './pollViewerService';

export class PollOptionResult {
  id: string;
  content: string;
  weight: number;
  percentage: number;
  constructor(id: string, content: string, weight: number, percentage: number) {
    this.id = id;
    this.content = content;
    this.weight = weight;
    this.percentage = percentage;
  }
}

export interface IPollViewerStore extends IEventListenerStore {
  pollId: string;
  title: string;
  options: Array<PollOptionResult>;
  chosenOption: PollOptionResult | null;
  loading: boolean;
  loadingVote: boolean;
  noPoll: boolean;
  setPollId(pollId: string): void;
  loadNewPoll(pollId: string): void;
  voteOnPoll(pollOptionId: string): void;
  loadPollOnHydration(): void;
}

export class PollViewerStore implements IPollViewerStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable pollId: string = "";
  @observable title: string = "";
  @observable options: Array<PollOptionResult> = [];
  @observable chosenOption: PollOptionResult | null = null;
  @observable loading: boolean = false;
  @observable loadingVote: boolean = false;
  @observable noPoll: boolean = false;

  @action
  loadPollOnHydration(): void {
    if (this.pollId) {
      this.loadNewPoll(this.pollId);
    }
  }

  @action
  setPollId(pollId: string): void {
    this.pollId = pollId;
  }

  @action
  loadNewPoll(pollId: string): void {
    this.pollId = pollId;
    this.options = [];
    this.chosenOption = null;

    this.fetchPollFlow(this);
  }

  @action
  voteOnPoll(pollOptionId: string): void {
    const option = this.options.find(({id}: PollOption) => {
      return id === pollOptionId;
    });
    if (option) {
      this.voteOnPollFlow(this, option);
    }
  }

  @computed
  public get getSubscribedEvents(): string[] {
    return ['poll_update' + this.pollId];
  }

  @action
  handleMessage(message: IncomingMessage): void {
    console.log("message in store!");
    console.log(message);
    this.pollId = message.poll_id;
    this.title = message.title;
    this.options = PollViewerStore.parseOptions(message.poll_options);
  }

  private static parseOptions(rawOptions: Array<any>): Array<PollOptionResult> {
    let options = [];
    for (let n = 0; n < rawOptions.length; n++) {
      const {poll_option_id, content, vote_percentage, vote_weight} = rawOptions[n];
      options.push(new PollOptionResult(poll_option_id, content, vote_weight, parseFloat(vote_percentage)));
    }
    return options;
  }

  private static parseUserOption(rawOptions: Array<any>, userVote: string | null): PollOptionResult | null {
    if (!userVote) {
      return null;
    }
    return rawOptions.find(({poll_option_id}) => poll_option_id === userVote);
  }

  fetchPollFlow = flow(function* (store: PollViewerStore): any {
    store.loading = true;
    store.noPoll = false;
    try {
      const data = yield fetchPollData(store.pollId, store.rootStore.authStore.jwtToken);
      store.pollId = data.poll_id;
      store.title = data.title;
      store.options = PollViewerStore.parseOptions(data.poll_options);
      store.chosenOption = PollViewerStore.parseUserOption(data.poll_options, data.user_vote);
      store.loading = false;
    } catch (e) {
      store.loading = false;
      store.noPoll = true;
      store.title = '';
      store.options = [];
      store.chosenOption = null;
      console.error(e.message);
    }
  });

  voteOnPollFlow = flow(function* (store: PollViewerStore, pollOption: PollOptionResult): any {
    store.loadingVote = true;
    try {
      const data = yield voteOnPoll(store.pollId, pollOption.id, store.rootStore.authStore.jwtToken);
      store.pollId = data.poll_id;
      store.title = data.title;
      store.pollId = data.poll_id;
      store.title = data.title;
      store.options = PollViewerStore.parseOptions(data.poll_options);
      store.chosenOption = PollViewerStore.parseUserOption(data.poll_options, data.user_vote);
      store.loadingVote = false;
    } catch (e) {
      store.loadingVote = false;
      console.error(e.message);
    }
  })
}
