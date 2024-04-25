let currentEffect: (() => void) | null = null;

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

export function createEffect(effect: () => void) {
  const execute = () => {
    currentEffect = execute;
    effect();
    currentEffect = null;
  };

  execute();
}
