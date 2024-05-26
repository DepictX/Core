import {
  IMeasureContext,
  IMeasurement, IPrepareContext, LayoutType, Node,
} from '@depict-x/core';
import { injectable } from 'inversify';

@injectable()
export class Relative implements IMeasurement<Node> {
  layoutType = LayoutType.Element;

  prepare(node: Node, ctx: IPrepareContext) {
    const minWidth = node.style?.minWidth;
    const maxWidth = node.style?.maxWidth;
    const minHeight = node.style?.minHeight;
    const maxHeight = node.style?.maxHeight;

    if (!node.firstChild) return {
      minWidth,
      maxWidth,
      minHeight,
      maxHeight, 
    };

    const children = node.children;

    return {
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      fitContent: Math.max(
        ...children.map(c => ctx.getNodeConstrains(c).fitContent || 0),
      ),
    };
  }

  measure(node: Node, ctx: IMeasureContext) {
    const width = node.parent
      ? ctx.getMetrics(node.parent).width
      : ctx.containerConstrains.width;
    const metrics = ctx.getMetrics(node);
    metrics.left = 0;
    metrics.width = width;
  }

  postMeasure(node: Node, ctx: IMeasureContext) {
    const metrics = ctx.getMetrics(node);
    metrics.height = node.firstChild
      ? node.children.reduce((s, c) => s + ctx.getBaseMetrics(c).height, 0)
      : 0;
    metrics.top = node.prevSibling
      ? ctx.getBaseMetrics(node.prevSibling).top + ctx.getBaseMetrics(node.prevSibling).height
      : 0;
  }
}
