type Handler<T = any> = (data: T) => void;

export class EventBus<Events extends Record<string, any>> {
  private listeners: Map<keyof Events, Set<Handler>> = new Map();

  /**
   * 이벤트 구독 (Subscribe)
   * @param key 이벤트 키
   * @param handler 이벤트 핸들러
   * @returns Unsubscribe 함수
   */
  on<Key extends keyof Events>(key: Key, handler: Handler<Events[Key]>) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(handler);

    // Unsubscribe 함수 반환
    return () => this.off(key, handler);
  }

  /**
   * 이벤트 구독 해제 (Unsubscribe)
   * @param key 이벤트 키
   * @param handler 이벤트 핸들러
   */
  off<Key extends keyof Events>(key: Key, handler: Handler<Events[Key]>) {
    const handlers = this.listeners.get(key);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * 이벤트 발생 (Emit/Dispatch)
   * @param key 이벤트 키
   * @param data 이벤트 데이터
   */
  emit<Key extends keyof Events>(key: Key, data: Events[Key]) {
    const handlers = this.listeners.get(key);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}
