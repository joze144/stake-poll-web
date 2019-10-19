import { action, computed, flow, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { RootStore } from '../rootStore';

import { fetchWallet, fetchWalletData, hasProvider, signMessage, verifySignMessage } from './web3Service';

const TWO_SECONDS = 2000;

export interface IAuthStore {
  userId: string;
  publicAddress: string;
  jwtToken: string;
  loggedId: boolean;
  metamaskConnected: boolean;
  hasWallet: boolean;
  getAuthorizationHeader: string;
  setUser(userId: string, jwtToken: string): void;
  logout(): void;
  checkWeb3Accounts(): void;
  fetchWeb3Accounts(): void;
  checkIfHasWallet(): void;
  login(): void;
}

export class AuthStore implements IAuthStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.measure();
  }

  @persist @observable loggedId: boolean = false;
  @persist @observable userId: string = '';
  @persist @observable publicAddress: string = '';
  @persist @observable hasWallet: boolean = false;
  @persist @observable metamaskConnected: boolean = false;
  @persist @observable jwtToken: string = '';

  @computed
  public get getAuthorizationHeader(): string {
    if (!this.jwtToken || this.jwtToken === '') {
      return '';
    }
    return this.jwtToken;
  }

  @action
  setUser(userId: string, jwtToken: string): void {
    if (!userId || userId === '' || !jwtToken || jwtToken === '') {
      return;
    }

    this.userId = userId;
    this.jwtToken = jwtToken;
    this.loggedId = true;
  }

  @action
  logout(): void {
    this.userId = '';
    this.jwtToken = '';
    this.loggedId = false;
  }

  @action
  measure() {
    this.checkWeb3Accounts();
    setTimeout(() => this.measure(), TWO_SECONDS);
  }

  @action
  fetchWeb3Accounts(): void {
    this.fetchWeb3AccountsFlow(this);
  }

  private fetchWeb3AccountsFlow = flow(function*(store: AuthStore): any {
    try {
      const wallet = yield fetchWallet();
      if (wallet && wallet.publicAddress && wallet.networkVersion === "1") {
        store.publicAddress = wallet.publicAddress;
        store.metamaskConnected = true;
      } else {
        store.userId = '';
        store.jwtToken = '';
        store.publicAddress = '';
        store.loggedId = false;
        store.metamaskConnected = false;
      }
    } catch (e) {
      store.userId = '';
      store.jwtToken = '';
      store.publicAddress = '';
      store.loggedId = false;
      store.metamaskConnected = false;
    }
  });

  @action
  checkWeb3Accounts(): void {
    this.checkWeb3AccountsFlow(this);
  }

  private checkWeb3AccountsFlow = flow(function*(store: AuthStore): any {
    try {
      const wallet = yield fetchWalletData();
      if (wallet && wallet.publicAddress && wallet.networkVersion === "1") {
        store.publicAddress = wallet.publicAddress;
        store.metamaskConnected = true;
      } else {
        store.userId = '';
        store.jwtToken = '';
        store.publicAddress = '';
        store.loggedId = false;
        store.metamaskConnected = false;
      }
    } catch (e) {
      store.userId = '';
      store.jwtToken = '';
      store.publicAddress = '';
      store.loggedId = false;
      store.metamaskConnected = false;
    }
  });

  @action
  checkIfHasWallet(): void {
    this.checkWalletFlow(this);
  }

  private checkWalletFlow = flow(function*(store: AuthStore): any {
    try {
      store.hasWallet = yield hasProvider();
    } catch (e) {
      store.hasWallet = false;
    }
  });

  @action
  login(): void {
    this.loginFlow(this);
  }

  private loginFlow = flow(function* (store: AuthStore): any {
    try {
      const data = yield signMessage(store.publicAddress, 'By signing this message we will validate your account. It does not cost anything');
      const serverResp = yield verifySignMessage(data);
      store.userId = serverResp.id;
      store.publicAddress = serverResp.public_address;
      store.jwtToken = serverResp.jwt_token;
      store.loggedId = true;
    } catch (e) {
      console.error(e.message)
    }
  })
}
