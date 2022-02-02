import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WsReceivable } from '../models/ws-receivable';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket;
  private receivers: WsReceivable[] = new Array<WsReceivable>();

  constructor() {
    this.initWebsocketConnection
  }

  /**
   * method to initialize the web socket
   */
  public async initWebsocketConnection() {
    console.log(`connecting to WebSocket server ${environment.websocketUrl}`);

    if (this.ws /*&& this.ws.readyState == WebSocket.OPEN*/) this.ws.close();

    this.ws = new WebSocket(environment.websocketUrl);
    this.ws.onopen = (event) => { console.log(event) };
    this.ws.onmessage = (event) => this.broadcast(JSON.parse(event.data));
    this.ws.onerror = (event) => { console.log(event); this.ws.close() };
    this.ws.onclose = (event) => { console.log(event); };
  }

  /**
   * checks if the web socket ist connected (or in connection)
   * @returns true if web socket is connected
   */
  public connected(): boolean {
    const ret = (this.ws) ? (this.ws.readyState == WebSocket.OPEN || this.ws.readyState == WebSocket.CONNECTING) : false;
    console.log(`Websocket is connected: ${ret}`);
    return ret;
  }

  /**
   * register a reveiver; the receiver implements the interface WsReceivable which requires these methods:
   *   topic(): Topics;
   *   receiveWebsocketMessage(data: any): void;
   * Topic is used to select the right messages
   * @param receiver
   */
  public register(receiver: WsReceivable) {
    this.receivers.push(receiver);
    console.log(`new listener registerd on topic ${receiver.topic()}; now ${this.receivers.length} registered`);
    if (!this.connected()) this.initWebsocketConnection();
  }

  /**
   * unregister a listener
   * @param receiver
   */
  public unregister(receiver: WsReceivable): void {
    console.log(`unregister receiver`);
    this.receivers = this.receivers.filter(el => {
      el === receiver;
    });

    // close connection if no receiver is interested
    console.log(`Remaining receivers: #${this.receivers.length} (when 0 then disconnect)`);
    if (this.receivers.length == 0) this.ws.close();
  }

  /**
   *
   * @param data must have this format (TODO: add an interface)
   * {
   *    topic: string,
   *    data: {} (depends on topic)
   * }
   */
  private broadcast(data: any): void {
    this.receivers.forEach(receiver => {

      if (data.topic && data.topic === receiver.topic()) {
        receiver.receiveWebsocketMessage(data);
      }

    });
  }

}
