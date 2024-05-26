import {
  IMetrics, Node, TextNode, 
} from '@depict-x/core';

export function getDefaultMetrics(node: Node): IMetrics {
  if (!(node instanceof TextNode)) {
    return {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      get props() {
        return node.props; 
      },
      get style() {
        return node.style;
      },
    };
  } else {
    return {
      get content() { 
        return node.content;
      },
      rects: [],
      baseline: 0,
      get props() {
        return node.props; 
      },
      get style() {
        return node.style;
      },
    };
  }
}
