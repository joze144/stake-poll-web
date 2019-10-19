import { IncomingMessage } from '../IncomingMessage';

export interface IEventSubscriptionComponent {
  handleMessage(message: IncomingMessage): void;
  getComponentId: string;
}

export interface IEventSubscriptionState {
  componentId: string;
}
