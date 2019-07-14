import { IncomingMessage } from '../events/IncomingMessage';

export interface IEventSubscription {
  handleMessage(message: IncomingMessage): void;
  getComponentId: string;
}

export interface IEventSubscriptionState {
  componentId: string;
}
