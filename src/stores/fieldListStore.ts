import { FieldObject } from '../events/FieldObject';
import { RootStore } from './rootStore';
import { action, computed, observable } from 'mobx';
import { IEventListenerStore } from './IEventListenerStore';
import { IncomingMessage } from '../events/IncomingMessage';
import v4 = require('uuid/v4');

export interface IFieldListStore extends IEventListenerStore {
  getPlayerFields: FieldObject[];
  getOpponentFields: FieldObject[];
}

const SUBSCRIBED_EVENTS = ['player_field_list', 'opponent_field_list', 'field_change'];

export class FieldListStore implements IFieldListStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    this.playerFieldList = [];
    for (let n = 0; n < 144; n++) {
      this.playerFieldList.push(new FieldObject(v4(), false, false));
    }

    this.opponentFieldList = [];
    for (let n = 0; n < 144; n++) {
      this.opponentFieldList.push(new FieldObject(v4(), false, false));
    }
  }

  @observable activeGame: boolean = false;
  @observable playerFieldList: FieldObject[] = [];
  @observable opponentFieldList: FieldObject[] = [];

  public get getPlayerFields(): FieldObject[] {
    return this.playerFieldList;
  }

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
