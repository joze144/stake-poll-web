export class Message {
  public body?: object;
  public headers?: Header;

  constructor(body: object, headers?: Header) {
    this.body = body;
    this.headers = headers;
    if (this.headers == null) {
      this.headers = new Headers();
    }
  }
}

export class Header {
  [key: string]: any;
}
