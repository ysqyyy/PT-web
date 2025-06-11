import { Client, IMessage } from '@stomp/stompjs';

// WebSocket 服务器地址（和 Spring Boot 后端配置的一致）
const WS_URL = "ws://localhost:8080/ws"; // 修改为你的后端 WebSocket 地址

// STOMP 客户端
let stompClient: Client | null = null;

// 连接状态
let connected = false;

// 连接 WebSocket
export function connect(userId: string, onMessage: (msg: any) => void) {
  if (connected) return;

  stompClient = new Client({
    brokerURL: WS_URL,
    reconnectDelay: 5000,
    onConnect: () => {
      connected = true;
      // 订阅个人消息队列
      stompClient?.subscribe('/user/queue/messages', (message: IMessage) => {
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

// 断开连接
export function disconnect() {
  if (stompClient && connected) {
    stompClient.deactivate();
    connected = false;
  }
}

// 发送消息
export function sendMessage(fromUserId: string, toUserId: string, content: string) {
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