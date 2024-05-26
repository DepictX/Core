import {
  IMeasureContext,
  IMeasurement, IPrepareContext, LayoutType, Node, 
} from '@depict-x/core';
import { injectable } from 'inversify';

import { IFlexibleItemProps, IFlexibleProps } from './types';
import { justify, shareSpace } from './utils';

/**
 * https://www.w3.org/html/ig/zh/wiki/Css3-flexbox/zh-hans#flex-base-size
 */
@injectable()
export class Flexible<P extends IFlexibleProps = IFlexibleProps> implements IMeasurement<Node<P>> {
  layoutType = LayoutType.Element;

  willHandleChildren = true;

  prepare(node: Node<P>, ctx: IPrepareContext) {
    const children = node.children;

    return {
      fitContent: Math.max(
        ...children.map(c => ctx.getNodeConstrains(c).fitContent || 0),
      ),
    };
  }

  measure(node: Node<P>, ctx: IMeasureContext) {
    const children = node.children as Node<IFlexibleItemProps>[];
    const {
      gap = 0,
      flexDirection = 'row',
      flexWrap = 'nowrap',
      // justifyContent = 'start',
      // alignItems = 'start',
    } = node.props;
    const isWrap = flexWrap !== 'nowrap';
    const metrics = ctx.getMetrics(node);
    const width = metrics.width || ctx.containerConstrains.width;
    const lines = [0];
  
    metrics.width = width;

    if (flexDirection !== 'column') {
      let space = width;
      let lineItems: { child: Node<IFlexibleItemProps>; supposeWidth: number }[] = [];
  
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const {
          minWidth = 0,
          maxWidth = Infinity,
          fitContent = 0,
        } = ctx.getNodeConstrains(child);
        const basic = child.props.flexBasic || child.style?.width;
        const supposeWidth = Math.max(
          minWidth,
          Math.min(
            maxWidth,
            !basic || basic === 'auto'
              ? fitContent
              : typeof basic === 'number'
                ? basic
                : width * Math.max(parseInt(basic), 100) * 100,
          ),
        );
        const outOfSpace = supposeWidth && space < supposeWidth + (i ? gap : 0);
  
        if (isWrap && outOfSpace) {
          // need a new line
          shareSpace(lineItems, space, ctx);
          justify(lineItems.map(({ child }) => child), node, ctx);
  
          if (i < children.length) lines.push(i);
          lineItems = [];
          space = width;
        } else {
          space -= supposeWidth + (i ? gap : 0);
        }
  
        lineItems.push({
          child,
          supposeWidth, 
        });
      }
  
      if (lineItems.length) {
        // share the space
        shareSpace(lineItems, space, ctx);
        justify(lineItems.map(({ child }) => child), node, ctx);
      }
  
      ctx.storage.lines = lines;
    }
  }

  postMeasure(node: Node<P>, ctx: IMeasureContext) {
    const children = node.children as Node<IFlexibleItemProps>[];
    const {
      gap = 0,
      flexDirection = 'row',
      // alignItems = 'start',
    } = node.props;
  
    if (flexDirection === 'row') {
      const lines: number[] = ctx.storage.lines;
      const childrenGroups = lines.map((line, index) => children
        .slice(line, lines[index + 1])
        .map(node => ({
          node,
          metrics: ctx.getBaseMetrics(node), 
        })));
  
      let lastTop = 0;
      childrenGroups.forEach(children => {
        const maxHeight = children.reduce((max, child) => Math.max(max, child.metrics.height), 0);
        children.forEach(child => {
          child.metrics!.height = maxHeight;
          child.metrics!.top = lastTop;
        });
        lastTop += maxHeight + gap;
      });
  
      const metrics = ctx.getMetrics(node);
      metrics.height = childrenGroups.reduce((h, group) =>
        h + group[0].metrics!.height, 0) + (lines.length - 1) * gap;
    }
  }
}
