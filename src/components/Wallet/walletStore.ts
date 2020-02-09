import { RootStore } from '../rootStore';
import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { IEventListenerStore } from '../EventSubscription/IEventListenerStore';
import { IncomingMessage } from '../IncomingMessage';

export class Balance {
  tokenId: string;
  balance: number;
  constructor(tokenId: string, balance: number) {
    this.tokenId = tokenId;
    this.balance = balance;
  }
}

export interface IWalletStore extends IEventListenerStore {
  ethBalance: number;
  balances: Balance[];
  setWalletBalances(balances: Balance[]): void;
  clearWallet(): void;
}

export class WalletStore implements IWalletStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  ethTokenId = '8bb6fd41-dc57-405f-87da-e372bc511efe';
  @persist @observable ethBalance: number = 0;
  @observable balances: Balance[] = [];

  @action
  public clearWallet(): void {
    this.ethBalance = 0;
    this.balances = [];
  }

  @action
  public setWalletBalances(balances: Balance[]): void {
    for (let n = 0; n < balances.length; n++) {
      const index = this.balances.findIndex(({tokenId}) => tokenId === balances[n].tokenId);
      if (index > -1) {
        this.balances[index] = balances[n];
      } else {
        this.balances.push(balances[n]);
      }

      if (balances[n].tokenId === this.ethTokenId) {
        this.ethBalance = balances[n].balance;
      }
    }
  }

  @computed
  public get getSubscribedEvents(): string[] {
    return ['balance_update'];
  }

  @action
  handleMessage(message: IncomingMessage): void {
    switch (message.message_type) {
      case 'balance_update':
        const newBalances = message.balances.map(({token_id, balance}: any) => {
          return new Balance(token_id, balance);
        });
        this.setWalletBalances(newBalances);
        return;
      default:
        return;
    }
  }
}
