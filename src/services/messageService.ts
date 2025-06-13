import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = "http://localhost:8080/ws"; // 注意这里是 http，不是 ws

let stompClient: Client | null = null;
let connected = false;

export function connect(userId: string, onMessage: (msg: any) => void) {
  if (connected) return;

  stompClient = new Client({
    // 关键：用 webSocketFactory + SockJS
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    onConnect: () => {
      connected = true;
      stompClient?.subscribe('/user/queue/messages', (message) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      });
      console.log('STOMP 已连接');
    },
    onStompError: (frame) => {
      console.error('STOMP 错误', frame.headers['message'], frame.body);
      connected = false;
    },
    onDisconnect: () => {
      connected = false;
      console.log('STOMP 已断开');
    },
  });

  stompClient.activate();
}

export function sendMessageWS(fromUserId: string, toUserId: string, content: string) {
  if (!stompClient || !connected) {
    console.error('未连接 STOMP');
    return;
  }
  stompClient.publish({
    destination: '/app/send_message',
    body: JSON.stringify({
      fromUserId,
      toUserId,
      content,
    }),
  });
}