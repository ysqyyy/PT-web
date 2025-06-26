type Callback = (...args: any[]) => void;

class EventBus {
  private events: Record<string, Callback[]> = {};

  // 监听事件
  on(event: string, cb: Callback) {
    (this.events[event] = this.events[event] || []).push(cb);
  }

  // 取消监听
  off(event: string, cb: Callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(fn => fn !== cb);
  }

  // 触发事件
  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;
    this.events[event].forEach(cb => cb(...args));
  }
}

export default new EventBus();