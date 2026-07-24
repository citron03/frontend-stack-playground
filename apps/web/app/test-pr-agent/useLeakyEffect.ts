import { useEffect } from 'react';

export default function useLeakyEffect(cb: () => void) {
  // 의도적: cleanup을 반환하지 않아 이벤트 리스너 누수 가능
  useEffect(() => {
    cb();
  }, []);
}
