import { useRef } from "react";

/**
 * 通用防抖 hook，传入函数和延迟时间，返回防抖后的函数
 * @param fn 需要防抖的函数
 * @param delay 防抖延迟，默认800ms
 */
export function useDebounceFn<T extends (...args: unknown[]) => void>(fn: T, delay = 800) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (...args: Parameters<T>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  };
}
