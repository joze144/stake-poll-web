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
  numberOfVoters: number;
  percentage: number;
  constructor(id: string, content: string, weight: number, numberOfVoters: number, percentage: number) {
    this.id = id;
    this.content = content;
    this.weight = weight;
    this.numberOfVoters = numberOfVoters;
    this.percentage = percentage;
  }
}

export interface IPollViewerStore extends IEventListenerStore {
  pollId: string;
  title: string;
  options: Array<PollOptionResult>;
  viewsNumber: number,
  votersNumber: number,
  totalTokenAmount: number,
  url: string;
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
  @observable viewsNumber: number = 0;
  @observable votersNumber: number = 0;
  @observable totalTokenAmount: number = 0;
  @observable url: string = "";
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
    this.pollId = message.poll_id;
    this.title = message.title;
    this.options = PollViewerStore.parseOptions(message.poll_options);
    this.votersNumber = message.number_of_voters;
    this.totalTokenAmount = message.amount_of_token / 1000;
    this.viewsNumber = message.total_views;
    this.url = message.url;
  }

  private static parseOptions(rawOptions: Array<any>): Array<PollOptionResult> {
    let options = [];
    for (let n = 0; n < rawOptions.length; n++) {
      const {poll_option_id, content, number_of_voters, vote_percentage, vote_weight} = rawOptions[n];
      options.push(new PollOptionResult(poll_option_id, content, vote_weight, number_of_voters, parseFloat(vote_percentage)));
    }
    return options;
  }

  private static parseUserOption(rawOptions: Array<any>, userVote: string | null): PollOptionResult | null {
    if (!userVote) {
      return null;
    }
    const option = rawOptions.find(({poll_option_id}) => poll_option_id === userVote);
    if (!option) {
      return null;
    }
    return new PollOptionResult(option.poll_option_id, option.content, option.vote_weight, option.number_of_voters, parseFloat(option.vote_percentage));
  }

  fetchPollFlow = flow(function* (store: PollViewerStore): any {
    store.loading = true;
    store.noPoll = false;
    try {
      const data = yield fetchPollData(store.pollId, store.rootStore.authStore.jwtToken);
      store.pollId = data.poll_id;
      store.title = data.title;
      store.chosenOption = PollViewerStore.parseUserOption(data.poll_options, data.user_vote);
      store.options = PollViewerStore.parseOptions(data.poll_options);
      store.votersNumber = data.number_of_voters;
      store.totalTokenAmount = data.amount_of_token / 1000;
      store.viewsNumber = data.total_views;
      store.url = data.url;
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
      store.votersNumber = data.number_of_voters;
      store.totalTokenAmount = data.amount_of_token / 1000;
      store.viewsNumber = data.total_views;
      store.url = data.url;
      store.chosenOption = PollViewerStore.parseUserOption(data.poll_options, data.user_vote);
      store.loadingVote = false;
    } catch (e) {
      store.loadingVote = false;
      console.error(e.message);
    }
  })
}
