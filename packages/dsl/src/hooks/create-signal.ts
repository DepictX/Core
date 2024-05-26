import { currentEffect } from './create-effect';

export function createSignal<T>(initialValue: T): [() => T, (v: T) => void] {
  let value = initialValue;
  const listeners = new Set<() => void>();

  const signal = () => {
    track(listeners);
    return value;
  };

  const setter = (newValue: T) => {
    if (value !== newValue) {
      value = newValue;
      listeners.forEach(listener => listener());
    }
  };

  return [signal, setter];
}

function track(listener: Set<() => void>) {
  if (currentEffect) {
    listener.add(currentEffect);
  }
}
