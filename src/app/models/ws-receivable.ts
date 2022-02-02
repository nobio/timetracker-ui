export enum Topics {
  GEOLOC = "GEO-LOCATION",
}

export interface WsReceivable {
  topic(): Topics;
  receiveWebsocketMessage(data: any): void;
}
