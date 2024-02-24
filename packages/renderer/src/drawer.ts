import { Text } from "layout";
import { Node } from "engine/src/node";

export function drawFiber(ctx: CanvasRenderingContext2D, node: Node, offsets: { left: number; top: number }) {
  const { metrics } = node;

  if (!metrics) throw new Error('Fiber is not measured!');

  const left = metrics.left + offsets.left;
  const top = metrics.top + offsets.top;

  if (node.type === Text) {
    const text = node.props.content;
    ctx.fillStyle = node.props.style?.color || 'black';
    ctx.font = node.props.style?.font || '16px Arial';
    ctx.textBaseline = 'top';
    ctx.fillText(text, left, top);
  } else {
    ctx.fillStyle = node.props.style?.backgroundColor || 'white';
    ctx.fillRect(left, top, metrics.width, metrics.height);
  }

  const children = node.children;

  // 绘制子节点
  children.forEach((child) => {
    const { metrics: childMetrics } = child;
    if (!childMetrics) throw new Error('Child is not measured!');
    const childLayoutData = {
      left: metrics.left + (childMetrics.left || 0),
      top: metrics.top + (childMetrics.top || 0),
      width: childMetrics.width || 0,
      height: childMetrics.height || 0,
    };
    drawFiber(ctx, child, { left, top });
  });
}