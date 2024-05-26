import {
  IMeasureContext,
  IMeasurement, IPrepareContext, ITextMetrics, LayoutType, Node,
  TextNode, 
} from '@depict-x/core';
import { LineBreaker } from 'css-line-break';
import { injectable } from 'inversify';

import { measureText } from '../text/measurement';

@injectable()
export class Inline implements IMeasurement<Node> {
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
      fitContent: children.reduce(
        (s, c) => s + (ctx.getNodeConstrains(c).fitContent || 0),
        0,
      ),
    };
  }

  measure(_node: Node, _ctx: IMeasureContext) {
  }
  
  postMeasure(node: Node, ctx: IMeasureContext) {
    const width = node.parent
      ? ctx.getMetrics(node.parent).width
      : ctx.containerConstrains.width;

    const metrics = ctx.getMetrics(node);
    metrics.left = 0;
    metrics.width = width;

    const children = node.children;

    let remain = width;
    let top = 0;
    let maxHeight = 0;
    // TODO: just a demo
    children.forEach((child, index) => {
      if (!(child instanceof TextNode)) {
        return;
      }
      
      const fontFamily = child.style?.fontFamily || 'Arial';
      const fontSize = child.style?.fontSize || 16;
      const { fitContent } = ctx.getNodeConstrains(child);
      const metrics = ctx.getMetrics(child);
      
      metrics.rects = [];
      
      if (fitContent && remain >= fitContent) {
        const { width: wordWidth, height } = measureText(child.content, fontFamily, fontSize);
        const rect: ITextMetrics['rects'][0] = {
          metrics: {
            left: width - remain,
            top: 0,
            width: wordWidth,
            height,
          },
          range: [0, child.content.length],
        };
        metrics.rects.push(rect);

        remain -= wordWidth;
        maxHeight = Math.max(height, maxHeight);
      } else {
        const breaker = LineBreaker(child.props.content, { wordBreak: 'break-all' });
        const words: string[] = [];
        let bk;

        while (!(bk = breaker.next()).done) {
          words.push(bk.value.slice());
        }

        // just one line
        if (words.length <= 1 && !index) {
          const { width: wordWidth, height } = measureText(child.content, fontFamily, fontSize);
          const rect: ITextMetrics['rects'][0] = {
            metrics: {
              left: width - remain,
              top: 0,
              width: wordWidth,
              height,
            },
            range: [0, child.content.length],
          };
          metrics.rects.push(rect);
          maxHeight = height;
        } else {
          let index = 0;
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const { width: wordWidth, height } = measureText(word, fontFamily, fontSize);
            if (remain >= wordWidth) {
              const rect: ITextMetrics['rects'][number] = {
                metrics: {
                  left: width - remain,
                  top,
                  width: wordWidth,
                  height,
                },
                range: [index, index + word.length],
              };
              metrics.rects.push(rect);
              remain -= wordWidth;
              maxHeight = Math.max(height, maxHeight);
            } else {
              top += height;
              const rect: ITextMetrics['rects'][0] = {
                metrics: {
                  left: 0,
                  top,
                  width: wordWidth,
                  height,
                },
                range: [index, index + word.length],
              };
              metrics.rects.push(rect);
              remain = width - wordWidth;
              maxHeight = height;
            }
            index += word.length;
          }
        }
      }
    });

    metrics.height = top + maxHeight;
  }
}
