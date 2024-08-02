import { type ILayout, LayoutExtensionId, IPoint, type IReconciler, ReconcilerExtensionId, INode, Node, TextNode, IRelativePoint } from '@depict-x/core';
import { inject, injectable } from 'inversify';
import { contain } from '../geometry-utils';

@injectable()
export class Picker {
  @inject(LayoutExtensionId)
  private _layout: ILayout;

  @inject(ReconcilerExtensionId)
  private _reconciler: IReconciler;

  getByPoint(point: IPoint) {
    const root = this._reconciler.getRoot();
    const path: INode[] = [];
    const stack = [root];

    while (stack.length) {
      const node = stack.pop()!;

      if (node instanceof TextNode) {
        const metrics = this._layout.getMetrics(node);
        metrics.rects.forEach(rect => {
          // if (contain(point, ))
        });
      }
      // const range = { x: metrics }

      // if (contain(point, metrics)) {}
    }
  }

  private findHitTarget(node: Node, point: IRelativePoint) {
    if (node instanceof TextNode) {
      const metrics = this._layout.getMetrics(node);
      for (const rect of metrics.rects) {
        if (contain(point, rect.metrics)) {
          return node;
        }
      }
    } else {
      const metrics = this._layout.getMetrics(node);
      if (contain(point, metrics)) {
        const newPoint = {};
        for (const child of node.children) {
          const target = this.findHitTarget(child, newPoint);
          if (target) return;
        }
      }
    }

    return false;
  }

  private getPath() {}
}
