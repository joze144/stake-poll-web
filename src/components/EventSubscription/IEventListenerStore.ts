import { IncomingMessage } from '../IncomingMessage';

export interface IEventListenerStore {
  getSubscribedEvents: string[];
  handleMessage(message: IncomingMessage): void;
}
