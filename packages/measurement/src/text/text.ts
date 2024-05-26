import {
  IFontStyle,
  IMeasureContext,
  IMeasurement, LayoutType, Node,
  TextNode, 
} from '@depict-x/core';
import { injectable } from 'inversify';

import { measureText } from './measurement';

export interface ITextProps {
  content?: string;
}

@injectable()
export class Text<
  P extends ITextProps = ITextProps,
  S extends IFontStyle = IFontStyle,
> implements IMeasurement<Node<P>> {
  layoutType = LayoutType.Text;

  prepare(node: Node<P, S>) {
    const text = node.props.content || '';
    const fontFamily = node.style?.fontFamily || 'Arial';
    const fontSize = node.style?.fontSize || 16;

    const { width } = measureText(text, fontFamily, fontSize);

    return {
      fitContent: width,
    };
  }

  measure(node: TextNode<P, S>, ctx: IMeasureContext) {
    const text = node.props.content || '';
    const fontFamily = node.style?.fontFamily || 'Arial';
    const fontSize = node.style?.fontSize || 16;
    const { width, height, baseline } = measureText(text, fontFamily, fontSize);
    const metrics = ctx.getMetrics(node);
    const { prevSibling } = node;
    const leftMetrics =
      prevSibling && prevSibling instanceof TextNode ?
        ctx.getMetrics(prevSibling).rects.at(-1)?.metrics :
        prevSibling && ctx.getMetrics(prevSibling);

    metrics.baseline = baseline;
    metrics.rects = [{
      range: [0, text.length],
      metrics: {
        width,
        height,
        left: leftMetrics ? leftMetrics.width + leftMetrics.left : 0,
        top: 0,
      },
    }];
  }
}
