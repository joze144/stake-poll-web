import { action, computed, flow, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { RootStore } from '../rootStore';

import { fetchWallet, fetchWalletData, hasProvider, signMessage, verifySignMessage } from './web3Service';
import { Balance } from '../Wallet/walletStore';

const TWO_SECONDS = 2000;

interface AuthHeader {
  Authorization: string;
}

export interface IAuthStore {
  userId: string;
  publicAddress: string;
  jwtToken: string;
  loggedId: boolean;
  metamaskConnected: boolean;
  hasWallet: boolean;
  getAuthorizationHeader: AuthHeader;
  hydrated: boolean;
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
  @observable hydrated: boolean = false;

  @computed
  public get getAuthorizationHeader(): AuthHeader {
    if (!this.jwtToken || this.jwtToken === '') {
      return { Authorization: '' };
    }
    return { Authorization: this.jwtToken };
  }

  @action
  logout(): void {
    this.userId = '';
    this.jwtToken = '';
    this.loggedId = false;
    this.rootStore.historyStore!.clearHistory();
    this.rootStore.walletStore!.clearWallet();
    this.rootStore.websocketStore!.connectSocket();
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
      const newBalances = serverResp.balances.map(({token_id, balance}: any) => {
        return new Balance(token_id, balance);
      });
      store.rootStore.walletStore.setWalletBalances(newBalances);
      store.loggedId = true;
      store.rootStore.websocketStore!.connectSocket();
      store.rootStore.gaStore!.setUser();
    } catch (e) {
      console.error(e.message)
    }
  })
}
