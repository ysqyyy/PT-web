import { useRef, useCallback } from "react";

/**
 * 用于事件（如 onSubmit）防抖的 hook，支持异步和事件参数快照
 * @param fn 需要防抖的函数（支持 async）
 * @param delay 防抖延迟，默认 800ms
 * @returns 防抖后的函数
 */
export function useEventDebounce<T extends (...args: any[]) => any>(fn: T, delay = 800) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  return useCallback((...args: Parameters<T>) => {
    args[0].preventDefault();
    if (timer.current) clearTimeout(timer.current);
     // 事件对象快照处理
    args[0].persist();
    timer.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);
}
