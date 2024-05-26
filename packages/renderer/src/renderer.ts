import {
  Extension, type ILayout, IRenderer, LayoutExtensionId, Node, 
} from '@depict-x/core';
import { inject, injectable } from 'inversify';

import { drawFiber } from './drawer';

export interface IRendererOptions {
  canvas: HTMLCanvasElement;
}

@injectable()
export class Renderer extends Extension<IRendererOptions> implements IRenderer {
  @inject(LayoutExtensionId) private _layout: ILayout;

  render(node: Node) {
    const { canvas } = this._options;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawFiber(ctx, node, this._layout.getMetrics.bind(this._layout), {
        left: 0,
        top: 0, 
      });
    }
  }
}
