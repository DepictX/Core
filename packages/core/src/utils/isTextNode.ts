import { Node, TextNode } from '../node';

export function isTextNode(node: Node | TextNode): node is TextNode {
  return node instanceof TextNode;
}
