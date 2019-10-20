import { RootStore } from '../rootStore';
import { computed, observable } from 'mobx';
import { v4 } from 'uuid';
import { IEventListenerStore } from '../EventSubscription/IEventListenerStore';
import { IncomingMessage } from '../IncomingMessage';


export class Ship {
  id: string;
  length: number;
  vertical: boolean;
  fields: string[];
  positioned: boolean;

  constructor(length: number) {
    this.id = v4();
    this.length = length;
    this.vertical = false;
    this.fields = [];
    this.positioned = false;
  }
}

export interface IGameStore extends IEventListenerStore {
  gameId: string;
  gameState: number;
  ships: Ship[];
  currentShip: string;
}

const SUB_EVENTS = ['game_update'];

export class GameStore implements IGameStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    let ships = [];
    for (let n = 0; n < 5; n++) {
      ships.push(new Ship(getShipLength(n)));
    }
    this.ships = ships;
  }

  @observable gameId: string = '';
  @observable gameState: number = 0;
  @observable ships: Ship[] = [];
  @observable currentShip: string = '';

  @computed
  public get getSubscribedEvents(): string[] {
    return SUB_EVENTS;
  }

  handleMessage(message: IncomingMessage): void {
    switch (message.message_type) {
      case 'game_update':
        console.log(message);
        return;
      default:
        console.error('Unhandled message');
        return;
    }
  }
}

function getShipLength(n: number): number {
  switch (n) {
    case 0:
      return 2;
    case 1:
      return 3;
    case 2:
      return 3;
    case 3:
      return 4;
    case 4:
      return 5;
    default:
      console.error('Not handled number!');
      return 0;
  }
}
