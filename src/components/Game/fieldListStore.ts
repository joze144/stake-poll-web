import { RootStore } from '../rootStore';
import { action, computed, observable } from 'mobx';
import { IEventListenerStore } from '../EventSubscription/IEventListenerStore';
import { IncomingMessage } from '../IncomingMessage';
import { v4 } from 'uuid';

export class FieldObject {
  fieldId: string;
  isHit: boolean;
  isPlayer: boolean;
  isShip: boolean;
  isAccessed: boolean;

  constructor(id: string, isHit: boolean, isPlayer: boolean, isShip: boolean, isAccessed: boolean) {
    this.fieldId = id;
    this.isHit = isHit;
    this.isPlayer = isPlayer;
    this.isShip = isShip;
    this.isAccessed = isAccessed;
  }
}

export interface IFieldListStore extends IEventListenerStore {
  getPlayerFields: FieldObject[];
  getOpponentFields: FieldObject[];
  getHasMove: boolean;
  getIsActiveGame: boolean;
}

const SUBSCRIBED_EVENTS = ['player_field_list', 'opponent_field_list', 'field_change'];

export class FieldListStore implements IFieldListStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    this.playerFieldList = [];
    for (let n = 0; n < 144; n++) {
      this.playerFieldList.push(new FieldObject(v4(), false, true, true, false));
    }

    this.opponentFieldList = [];
    for (let n = 0; n < 144; n++) {
      this.opponentFieldList.push(new FieldObject(v4(), false, false, false, false));
    }
  }

  @observable isActiveGame: boolean = false;
  @observable hasMove: boolean = false;
  @observable playerFieldList: FieldObject[] = [];
  @observable opponentFieldList: FieldObject[] = [];

  @computed
  public get getHasMove(): boolean {
    return this.hasMove;
  }

  @computed
  public get getIsActiveGame(): boolean {
    return this.isActiveGame;
  }

  @computed
  public get getPlayerFields(): FieldObject[] {
    return this.playerFieldList;
  }

  @computed
  public get getOpponentFields(): FieldObject[] {
    return this.opponentFieldList;
  }

  @action
  setPlayerList(list: FieldObject[]) {
    this.playerFieldList = list;
  }

  @action
  setOpponentList(list: FieldObject[]) {
    this.opponentFieldList = list;
  }

  @action
  setFieldChange(field: FieldObject) {
    const index = this.playerFieldList.findIndex((field: FieldObject) => field.fieldId === field.fieldId);
    if (index > -1) {
      this.playerFieldList[index] = field;
    }

    const index2 = this.opponentFieldList.findIndex((field: FieldObject) => field.fieldId === field.fieldId);
    if (index2 > -1) {
      this.opponentFieldList[index2] = field;
    }
  }

  @computed
  public get getSubscribedEvents(): string[] {
    return SUBSCRIBED_EVENTS;
  }

  @action
  handleMessage(message: IncomingMessage): void {
    switch (message.messageType) {
      case 'player_field_list':
        this.setPlayerList(message.body);
        break;
      case 'opponent_field_list':
        this.setOpponentList(message.body);
        break;
      case 'field_change':
        this.setFieldChange(message.body);
        break;
      default:
        console.error('Not handled message in auth store');
        console.log(message);
    }
  }
}
