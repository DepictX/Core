import {
  ILayout, isTextNode, Node, TextNode, 
} from '@depict-x/core';

export function drawFiber(
  ctx: CanvasRenderingContext2D,
  node: Node | TextNode,
  getMetrics: ILayout['getMetrics'],
  offsets: { left: number; top: number },
) {
  let left = 0;
  let top = 0;

  if (isTextNode(node)) {
    const metrics = getMetrics(node);
    const { fontSize = '16', color = 'black', fontFamily = 'Arial' } = node.style || {};
    
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';

    metrics.rects.forEach(({ metrics: { left, top }, range: [start, end] }) => {
      ctx.fillText(metrics.content.slice(start, end), left + offsets.left, top + offsets.top);
    });
  } else {
    const metrics = getMetrics(node);

    left = metrics.left + offsets.left;
    top = metrics.top + offsets.top;
  
    ctx.fillStyle = node.style?.backgroundColor || 'white';
    ctx.fillRect(left, top, metrics.width, metrics.height);
  }

  const children = node.children;

  // 绘制子节点
  children.forEach(child => {
    // const { metrics: childMetrics } = child;
    // if (!childMetrics) throw new Error('Child is not measured!');
    // const _childLayoutData = {
    //   left: metrics.left + (childMetrics.left || 0),
    //   top: metrics.top + (childMetrics.top || 0),
    //   width: childMetrics.width || 0,
    //   height: childMetrics.height || 0,
    // };
    drawFiber(ctx, child, getMetrics, {
      left,
      top, 
    });
  });
}
