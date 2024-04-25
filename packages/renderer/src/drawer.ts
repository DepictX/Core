import { INode } from 'engine';
import { Text } from 'layout';

export function drawFiber(ctx: CanvasRenderingContext2D, node: INode, offsets: { left: number; top: number }) {
  const { metrics, rects } = node;

  if (!metrics) throw new Error('Fiber is not measured!');

  const left = metrics.left + offsets.left;
  const top = metrics.top + offsets.top;

  if (node.type === Text) {
    ctx.fillStyle = node.props.style?.color || 'black';
    ctx.font = node.props.style?.font || '16px Arial';
    ctx.textBaseline = 'top';

    if (rects) {
      rects.forEach(({ word, left, top }) => {
        ctx.fillText(word, left + offsets.left, top + offsets.top);
      });
    } else {
      const text = node.props.content;
      ctx.fillText(text, left, top);
    }
  } else {
    ctx.fillStyle = node.props.style?.backgroundColor || 'white';
    ctx.fillRect(left, top, metrics.width, metrics.height);
  }

  const children = node.children;

  // 绘制子节点
  children.forEach(child => {
    const { metrics: childMetrics } = child;
    if (!childMetrics) throw new Error('Child is not measured!');
    const _childLayoutData = {
      left: metrics.left + (childMetrics.left || 0),
      top: metrics.top + (childMetrics.top || 0),
      width: childMetrics.width || 0,
      height: childMetrics.height || 0,
    };
    drawFiber(ctx, child, {
      left,
      top, 
    });
  });
}
