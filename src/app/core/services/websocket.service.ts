
import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client/dist/sockjs.js';
import 'globalthis/auto';
import { NotificationService } from './notification.service';
import {Client, IMessage, StompConfig} from "@stomp/stompjs";
import {WEBSOCKET_ENDPOINT, WEBSOCKET_NOTIFY_TOPIC} from "../../constants/base-url.constants";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  stompClient!: Client;

  constructor(private notificationService: NotificationService) { }

  connect(topic : string, type:string): void {
    console.log('webSocket Connection');
    const ws = new SockJS(WEBSOCKET_ENDPOINT);
    const stompConfig: StompConfig = {
      webSocketFactory: () => ws
    };
    this.stompClient = new Client(stompConfig);
    this.stompClient.onConnect = (frame) => {
      this.stompClient.subscribe(WEBSOCKET_NOTIFY_TOPIC+topic, (sdkEvent: IMessage) => {
        this.onMessageReceived(sdkEvent, type);
      });
    };
    this.stompClient.activate();
  }


  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.deactivate();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  errorCallBack = (error: any) => {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.connect("", "");
    }, 5000);
  }

  onMessageReceived(message: IMessage, type:string): void {
    console.log('Message Received from Server :: ' + message);
    // Emits the event.
    if (type === "notif")
    this.notificationService.notificationMessage.emit(JSON.parse(message.body));

  }
}
