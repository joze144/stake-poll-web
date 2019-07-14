import { RootStore } from './rootStore';
import { action, observable } from 'mobx';

import { IEventSubscription } from '../components/IEventSubscription';

import { IncomingMessage } from '../events/IncomingMessage';

export interface IEventSubscriptionStore {
  registerComponent(component: any, subscribedEvents: string[]): void;
  unregisterComponent(component: any): void;
}

interface Subscription {
  [key: string]: string[];
}

interface Component {
  [key: string]: IEventSubscription;
}

export class EventSubscriptionStore implements IEventSubscriptionStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable subscriptions: Subscription = {};
  @observable components: Component = {};

  @action
  handleMessage(message: IncomingMessage): void {
    if (!this.subscriptions.hasOwnProperty(message.messageType)) {
      return;
    }
    const subscriptions = this.subscriptions[message.messageType];
    subscriptions.map(componentId => this.components[componentId].handleMessage(message));
  }

  @action
  registerComponent(component: IEventSubscription, subscribedEvents: string[]): void {
    const componentId = component.getComponentId;
    this.components[componentId] = component;

    subscribedEvents.map(event => {
      if (!this.subscriptions.hasOwnProperty(event)) {
        this.subscriptions[event] = [];
      }

      if (this.subscriptions[event].indexOf(componentId) === -1) {
        this.subscriptions[event].push(componentId);
      }
    });
  }

  @action
  unregisterComponent(component: IEventSubscription): void {
    const componentId = component.getComponentId;

    for (let [key, value] of Object.entries(this.subscriptions)) {
      this.subscriptions[key] = value.filter(entry => entry !== componentId);
    }

    delete this.components[componentId];
  }
}
