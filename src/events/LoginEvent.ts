import { SendEvents } from './EventTypes';

export class LoginEvent {
  private messageType: string;

  private username: string;
  private password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.messageType = SendEvents.ValidateLogin;
  }
}
