export let currentEffect: (() => void) | null = null;

export function createEffect(effect: () => void) {
  const execute = () => {
    currentEffect = execute;
    effect();
    currentEffect = null;
  };

  execute();
}
