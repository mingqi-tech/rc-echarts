/**
 * 变种添加事件监听函数方法
 * @param event
 * @param listener
 * @param options
 */
export function addEvent<K extends keyof WindowEventMap>(
  event: K,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): Subscription {
  window.addEventListener(event, listener, options);
  return {
    remove: (): void => {
      window.removeEventListener(event, listener);
    },
  };
}

export interface Subscription {
  remove: () => void;
}
