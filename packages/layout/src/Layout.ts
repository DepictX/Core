import {
  IConstrains, IMeasureContext, INode, InternalLayout, LayoutModule, MEASUREMENTS, 
} from 'engine';
import { Node } from 'engine/src/node';

export class Layout implements LayoutModule {
  type = 'Layout' as const;

  plugins: {
    type: InternalLayout;

  }[] = [];

  install(): void {

  }

  uninstall(): void {

  }

  measure(root: Node, containerMetrics: any) {
    const constrains = new Map<INode, IConstrains>();
    const containerConstrains = containerMetrics;
    const getNodeConstrains = (node: INode) => constrains.get(node)!;

    root.descendants({
      self: true,
      post: node => {
        const constrain = node.type[MEASUREMENTS].prepare(node, {
          containerConstrains,
          getNodeConstrains,
        });
        constrains.set(node, constrain);
      }, 
    });

    const skips = new Set<INode>();

    root.descendants({
      self: true,
      pre(node, storage) {
        const ctx: IMeasureContext = {
          storage,
          containerConstrains,
          getNodeConstrains, 
        };
        (!node.parent || !skips.has(node.parent)) && node.type[MEASUREMENTS].measure(node, ctx);
        ctx.skipChildren && skips.add(node);
      },
      post(node, storage) {
        const ctx = {
          storage,
          containerConstrains,
          getNodeConstrains, 
        };
        node.type[MEASUREMENTS].postMeasure?.(node, ctx);
      },
    });
  }
}
