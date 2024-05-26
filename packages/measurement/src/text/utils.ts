let canvas: HTMLCanvasElement;

export function getCanvasContext() {
  if (!canvas) canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Can not get canvas context');
  return ctx;
}
