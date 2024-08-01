import { INode } from './node';

export interface IRenderNode extends INode {
  render(): void;
}