import { LineBreaker } from 'css-line-break';
import {
  IDefaultProps,
  LAYOUT_TYPE,
  InternalLayout,
  BLOCK,
  MEASUREMENTS,
  INode,
} from 'engine';

import { DEFAULT_METRICS } from '../../consts';
import { measureText } from '../Text/measurement';

export const INLINE_SYMBOL = Symbol('Inline');

interface IInlineProps extends IDefaultProps {}

export const Inline: InternalLayout<IInlineProps> = (props: IInlineProps) => {
  return props.children;
};

Inline[LAYOUT_TYPE] = BLOCK;
Inline[MEASUREMENTS] = {
  prepare(node: INode<IInlineProps>, ctx) {
    if (!node.metrics) node.metrics = { ...DEFAULT_METRICS };

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
    console.assert(
      new Set(children.map(c => c.type[LAYOUT_TYPE])).size <= 1,
      'Can not mix BLOCK and INLINE nodes!',
    );

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
  },
  measure(_node, _ctx) {
  },
  postMeasure(node, ctx) {
    const width = node.metrics!.width = node.parent
      ? node.parent.metrics!.width
      : ctx.containerConstrains.width;
    node.metrics!.left = 0;

    const children = node.children;

    let remain = width;
    let top = 0;
    let maxHeight = 0;
    // TODO: just a demo
    children.forEach((child, index) => {
      const fontFamily = child.props.style?.fontFamily || 'Arial';
      const fontSize = child.props.style?.fontSize || 16;
      const { fitContent } = ctx.getNodeConstrains(child);
      if (fitContent && remain >= fitContent) {
        const { width: wordWidth, height } = measureText(child.props.content, fontFamily, fontSize);

        child.metrics!.left = width - remain;
        child.metrics!.top = top;

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
          child.metrics!.left = width - remain;
        } else {
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const { width: wordWidth, height } = measureText(word, fontFamily, fontSize);
            if (!child.rects) child.rects = [];
            if (remain >= wordWidth) {
              const rect = {
                top,
                left: width - remain,
                word,
              };
              child.rects.push(rect);
              remain -= wordWidth;
              maxHeight = Math.max(height, maxHeight);
            } else {
              top += height;
              const rect = {
                top,
                left: 0,
                word,
              };
              child.rects.push(rect);
              remain = width - wordWidth;
              maxHeight = height;
            }
          }
        }
      }
    });

    node.metrics!.height = top + maxHeight;
  },
};
