import { useCallback, useEffect, useState } from 'react';

import { EventBus } from './event-bus';

/**
 * 1. 이벤트를 발생시키는 훅 (Publisher)
 */
export function useEmit<Events extends Record<string, any>>(bus: EventBus<Events>) {
  return useCallback(
    <K extends keyof Events>(key: K, data: Events[K]) => {
      bus.emit(key, data);
    },
    [bus],
  );
}

/**
 * 2. 이벤트를 리스닝하여 "콜백"을 실행하는 훅 (Subscriber - Callback)
 */
export function useOn<Events extends Record<string, any>, K extends keyof Events>(
  bus: EventBus<Events>,
  key: K,
  callback: (data: Events[K]) => void,
) {
  useEffect(() => {
    // 구독 및 cleanup 자동 처리
    const unsubscribe = bus.on(key, callback);
    return () => unsubscribe();
  }, [bus, key, callback]);
}

/**
 * 3. 이벤트를 리스닝하여 "상태(State)"를 변경하는 훅 (Subscriber - Reactive State)
 * 데이터가 들어오면 컴포넌트를 리렌더링 시킴
 */
export function useEventState<Events extends Record<string, any>, K extends keyof Events>(
  bus: EventBus<Events>,
  key: K,
  initialState: Events[K],
): Events[K] {
  const [state, setState] = useState<Events[K]>(initialState);

  useEffect(() => {
    const handler = (data: Events[K]) => {
      setState(data);
    };
    const unsubscribe = bus.on(key, handler);
    return () => unsubscribe();
  }, [bus, key]);

  return state;
}

/**
 * (선택) 특정 이벤트 버스를 생성하는 헬퍼 함수
 */
export function createEventBusHooks<Events extends Record<string, any>>() {
  const bus = new EventBus<Events>();

  return {
    bus,
    useEmit: () => useEmit(bus),
    useOn: <K extends keyof Events>(key: K, callback: (data: Events[K]) => void) =>
      useOn(bus, key, callback),
    useEventState: <K extends keyof Events>(key: K, initialState: Events[K]) =>
      useEventState(bus, key, initialState),
  };
}
