import { INode, ViewModule } from 'engine';

import { drawFiber } from './drawer';

export class View implements ViewModule {
  type = 'View' as const;

  install(engine: any): void {
    const dpr = window.devicePixelRatio;
    const canvas = engine.container;
    const ctx = engine.container.getContext('2d');
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.width = canvas.width * dpr;
    canvas.height = canvas.height * dpr;
    ctx.scale(dpr, dpr);
  }

  uninstall(): void {

  }

  draw(canvas: HTMLCanvasElement, node: INode) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawFiber(ctx, node, {
        left: 0,
        top: 0, 
      });
    }
  }
}
