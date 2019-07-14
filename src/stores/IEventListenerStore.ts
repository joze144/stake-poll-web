import { IncomingMessage } from '../events/IncomingMessage';

export interface IEventListenerStore {
  getSubscribedEvents: string[];
  handleMessage(message: IncomingMessage): void;
}
