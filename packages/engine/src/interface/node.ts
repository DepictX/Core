import { InternalLayout } from './layout';
import { IMetrics } from './renderObject';
import { IStyle } from './style';

export interface INode<T = any> {
  // _id: string;
  parent: INode | null;
  firstChild: INode | null;
  lastChild: INode | null;
  prevSibling: INode | null;
  nextSibling: INode | null;

  type: InternalLayout;
  props: T;
  style: IStyle | null;

  // ----
  scrollTop?: number;
  scrollLeft?: number;
  children: INode[];
  metrics: IMetrics | null;
  rects?: { word: string; left: number; top: number }[];
}
