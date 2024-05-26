import { IElementMetrics, IMeasureContext, Node } from '@depict-x/core';

import { IFlexibleItemProps, IFlexibleProps } from './types';

export function justify(items: Node[], parent: Node<IFlexibleProps>, ctx: IMeasureContext) {
  const { gap = 0, justifyContent = 'start' } = parent.props;
  let left = 0;
  if (justifyContent === 'start') {
    items.forEach((child, index) => {
      const metrics = ctx.getMetrics<IElementMetrics>(child);
      metrics.left = left + (index ? ctx.getMetrics<IElementMetrics>(items[index - 1]).width + gap : 0);
      left = metrics.left;
    });
  }
}

export function shareSpace(
  items: { child: Node<IFlexibleItemProps>; supposeWidth: number; frozen?: boolean }[],
  space: number,
  ctx: IMeasureContext,
) {
  const flexibleItems = items.filter(({ child, supposeWidth, frozen }) => {
    const { flexGrow = 0, flexShrink = 1 } = child.props;
    if (!space || !flexGrow && !flexShrink || frozen) {
      const metrics = ctx.getMetrics<IElementMetrics>(child);
      metrics.width = supposeWidth;
      return false;
    }
    return true;
  });

  if (!flexibleItems.length) return;

  let illegal = false;

  if (space < 0) {
    const shrunkSpaces = flexibleItems.map(({ child, supposeWidth }) =>
      (child.props.flexShrink ?? 1) * supposeWidth);
    const total = shrunkSpaces.reduce((a, b) => a + b, 0);
    const ratios = shrunkSpaces.map(space => space / total);
    ratios.forEach((ratio, index) => {
      const { child, supposeWidth } = flexibleItems[index];
      const metrics = ctx.getMetrics<IElementMetrics>(child);
      const width = ratio * space + supposeWidth;

      if (child.style?.minWidth && width < child.style?.minWidth) {
        illegal = true;
        metrics.width = child.style.minWidth;
        flexibleItems[index].frozen = true;
        space -= width - child.style.minWidth;
      } else {
        metrics.width = width;
      }
    });
  } else {
    let total = flexibleItems.reduce((s, { child }) => s + (child.props.flexGrow ?? 0), 0);
    if (total < 1) total = 1;

    flexibleItems.forEach(item => {
      const { child, supposeWidth } = item;
      const metrics = ctx.getMetrics<IElementMetrics>(child);
      const width = child.props.flexGrow ? Math.floor(child.props.flexGrow) / total * supposeWidth : supposeWidth;

      if (child.style?.maxWidth && width > child.style.maxWidth) {
        illegal = true;
        metrics.width = child.style.maxWidth;
        item.frozen = true;
        space -= width - child.style.maxWidth;
      } else {
        metrics.width = width;
      }
    });
  }

  if (illegal) {
    shareSpace(items, space, ctx);
  }
}
