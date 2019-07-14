import { action, computed, observable } from 'mobx';
import { RootStore } from './rootStore';
import { IncomingMessage } from '../events/IncomingMessage';
import { IEventListenerStore } from './IEventListenerStore';

export interface IAuthStore extends IEventListenerStore {
  userId: string;
  jwtToken: string;
  userDetails: string;
  loggedId: boolean;
  getAuthorizationHeader: object;
  setUser(userId: string, jwtToken: string, userDetails: string): void;
  logout(): void;
}

export class AuthStore implements IAuthStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    const userId = localStorage.getItem('userId');
    const userDetails = localStorage.getItem('userDetails');
    const jwtToken = localStorage.getItem('jwtToken');

    if (userId && userDetails && jwtToken) {
      this.setUser(userId, jwtToken, userDetails);
    }
  }

  @observable loggedId: boolean = false;
  @observable userId: string = '';
  @observable userDetails: string = '';
  @observable jwtToken: string = '';

  @computed
  public get getAuthorizationHeader(): object {
    if (!this.jwtToken || this.jwtToken === '') {
      return { Authorization: '' };
    }
    return { Authorization: 'Bearer ' + this.jwtToken };
  }

  @action
  setUser(userId: string, jwtToken: string, userDetails: string): void {
    if (!userId || userId === '' || !jwtToken || jwtToken === '' || !userDetails || userDetails === '') {
      return;
    }

    this.userId = userId;
    this.jwtToken = jwtToken;
    this.userDetails = userDetails;
    this.loggedId = true;

    localStorage.setItem('userId', userId);
    localStorage.setItem('userDetails', userDetails);
    localStorage.setItem('jwtToken', jwtToken);
  }

  @action
  logout(): void {
    this.userId = '';
    this.userDetails = '';
    this.jwtToken = '';
    this.loggedId = false;

    localStorage.clear();
  }

  @computed
  public get getSubscribedEvents(): string[] {
    return ['bad-login', 'login-token'];
  }

  @action
  handleMessage(message: IncomingMessage): void {
    switch (message.messageType) {
      case 'login-token':
        this.setUser(message.token, message.token, 'gregor');
        break;
      default:
        console.error('Not handled message in auth store');
        console.log(message);
    }
  }
}
