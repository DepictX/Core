import {
  LAYOUT_TYPE, INode, InternalLayout, MEASUREMENTS, INLINE, IFontStyle, 
} from 'engine';

import { DEFAULT_METRICS } from '../../consts';

import { measureText } from './measurement';

export const TEXT_SYMBOL = Symbol('Text');

interface ITextProps {
  content?: string;
  style?: IFontStyle;
}

export const Text: InternalLayout<ITextProps> = _props => {
  return null;
};

Text[LAYOUT_TYPE] = INLINE;
Text[MEASUREMENTS] = {
  prepare(node: INode<ITextProps>, _ctx) {
    if (!node.metrics) node.metrics = { ...DEFAULT_METRICS };

    const text = node.props.content || '';
    const fontFamily = node.props.style?.fontFamily || 'Arial';
    const fontSize = node.props.style?.fontSize || 16;

    const { width } = measureText(text, fontFamily, fontSize);

    return {
      fitContent: width,
    };
  },
  measure(node, _ctx) {
    const text = node.props.content || '';
    const fontFamily = node.props.style?.fontFamily || 'Arial';
    const fontSize = node.props.style?.fontSize || 16;

    const { width, height } = measureText(text, fontFamily, fontSize);
    node.metrics!.width = width;
    node.metrics!.height = height;
    node.metrics!.left = node.prevSibling ? node.prevSibling.metrics!.left + node.prevSibling.metrics!.width : 0;
  },
};
